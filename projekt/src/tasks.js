const express = require('express');
const router = express.Router();

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


router.get('/tasks', isAuthenticated, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if(tasks.length == 0 ){
        return res.status(500).json({ message: "no tasks found" })
    }
    res.status(200).send(tasks);
});

router.post('/tasks', isAuthenticated, (req, res) => {
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

router.get('/tasks/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;

    res.setHeader("Content-Type", "application/json");

    const task = tasks.find(task => task.id == id);
    if(task) {
        res.status(200).send(task);
    } else {
        res.status(404).json({ message: "no task with this id found" });
    }

});

router.put('/tasks/:id', isAuthenticated, (req, res) => {
    const updatedTask = req.body;
    const id = req.params.id;
    updatedTask.id = id;

    res.setHeader("Content-Type", "application/json");

    const findTask = tasks.find(task => task.id == id);
    if(!findTask) {
        return res.status(404).json({ message: "no task with this id found" });
    }

    if(!updatedTask.title) {
        return res.status(400).json({ message: "title missing" });
    }

    if(!updatedTask.description) {
        return res.status(400).json({ message: "desription missing" });
    }

    if(!updatedTask.creator) {
        return res.status(400).json({ message: "creator missing" });
    }

    tasks = tasks.map(task => {
        if (task.id == id) {
            return { ...task, ...updatedTask };
        }
        return task;
    });
    res.status(200).send(updatedTask);
});

router.delete('/tasks/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;

    const findTask = tasks.find(task => task.id == id);
    if(!findTask) {
        res.setHeader("Content-Type", "application/json");
        return res.status(404).json({ message: "no task with this id found" });
    }

    tasks = tasks.filter(task => task.id != id);
    res.sendStatus(204);
});

module.exports = router;