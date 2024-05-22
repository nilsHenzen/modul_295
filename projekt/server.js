const express = require('express');
const app = express();
const session = require('express-session');
const port = 3000;
const password = "m295";
const validator = require('validator');

let tasks = [{
    "id": 1,
    "title": "aufräumen",
    "description": "mein Zimmer aufräumen",
    "doneAt": "",
    "creator": "max@mail.com"
    },
    {
    "id": 2,
    "title": "putzen",
    "description": "Wohnzimmer putzen",
    "doneAt": "",
    "creator": "hans@mail.ch"
    },
    {
    "id": 3,
    "title": "entsorgen",
    "description": "Samstags Müll wegbringen",
    "doneAt": "",
    "creator": "emil@mail.com"
    }
]

const isAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

app.use(express.json());

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));


app.get('/tasks', isAuthenticated, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if(tasks.length == 0 ){
        return res.status(500).json({ message: "no tasks found" })
    }
    res.status(200).send(tasks);
});

app.post('/tasks', isAuthenticated, (req, res) => {
    const newtask = req.body;

    res.setHeader("Content-Type", "application/json");

    if(!newtask.title) {
        return res.status(400).json({ message: "title missing" });
    }

    if(!newtask.description) {
        return res.status(400).json({ message: "desription missing" });
    }

    if(!newtask.creator) {
        return res.status(400).json({ message: "creator missing" });
    }

    let highestId = 0;
    for (const task of tasks) {
      if (task.id > highestId) {
        highestId = task.id;
      }
    }

    newtask.id = highestId + 1;
    tasks.push(newtask);

    res.status(201).send(newtask);
});

app.get('/tasks/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;

    res.setHeader("Content-Type", "application/json");

    const task = tasks.find(task => task.id == id);
    if(task) {
        res.status(200).send(task);
    } else {
        res.status(404).json({ message: "no task with this id found" });
    }

});

app.put('/tasks/:id', isAuthenticated, (req, res) => {
    const updatedTask = req.body;
    const id = req.params.id;
    updatedTask.id = id;

    res.setHeader("Content-Type", "application/json");

    const findTask = tasks.find(task => task.id == id);
    if(!findTask) {
        return res.status(404).json({ message: "no task with this id found" });
    }

    tasks = tasks.map(task => {
        if (task.id == id) {
            return { ...task, ...updatedTask };
        }
        return task;
    });
    res.status(200).send(updatedTask);
});

app.delete('/tasks/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;

    const findTask = tasks.find(task => task.id == id);
    if(!findTask) {
        res.setHeader("Content-Type", "application/json");
        return res.status(404).json({ message: "no task with this id found" });
    }

    tasks = tasks.filter(task => task.id != id);
    res.sendStatus(204);
});

app.post('/login', (req, res) => {
    const credentials = atob(req.headers.authorization.replace("Basic ", "")).split(":");
    res.setHeader("Content-Type", "application/json");
    if (validator.isEmail(credentials[0]) && credentials[1] === password) {
        req.session.mail = credentials[0];
        req.session.authenticated = true;
        res.status(201).json({ message: "succesfully logged in" });
    } else {
        res.status(401).json({ message: "wrong credentials" });
    }
});

app.get('/verify', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.session.authenticated) {
        res.status(200).json({ email: req.session.mail, session: "valid" });
    } else {
        res.status(401).json({ message: "not logged in" });
    }
});

app.delete('/logout', (req, res) => {
    req.session.authenticated = false;
    req.session.mail = "";
    res.status(204).send();
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});