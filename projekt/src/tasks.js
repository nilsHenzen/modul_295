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
        return res.status(401).json({ message: "unauthorized, login to access" });
    }
};

router.get('/tasks', isAuthenticated, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (tasks.length == 0) {
        console.log("no tasks found");
        return res.status(500).json({ message: "no tasks found" });
    }
    console.log("get all tasks");
    res.status(200).send(tasks);
});

router.post('/tasks', isAuthenticated, (req, res) => {
    const newtask = req.body;

    res.setHeader("Content-Type", "application/json");

    if (!newtask.title || newtask.title == "") {
        console.log("title missing");
        return res.status(400).json({ message: "title missing" });
    }

    if (!newtask.description) {
        console.log("description missing");
        return res.status(400).json({ message: "desription missing" });
    }

    if (!newtask.creator) {
        console.log("creator missing");
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

    console.log("new task created");
    res.status(201).send(newtask);
});

router.get('/tasks/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;

    res.setHeader("Content-Type", "application/json");

    const task = tasks.find(task => task.id == id);
    if (task) {
        console.log("get single task");
        res.status(200).send(task);
    } else {
        console.log("task with defined id not found");
        res.status(404).json({ message: "no task with this id found" });
    }

});

router.put('/tasks/:id', isAuthenticated, (req, res) => {
    const updatedTask = req.body;
    const id = req.params.id;
    updatedTask.id = id;

    res.setHeader("Content-Type", "application/json");

    const findTask = tasks.find(task => task.id == id);
    if (!findTask) {
        console.log("task with defined id not found");
        return res.status(404).json({ message: "no task with this id found" });
    }

    if (!updatedTask.title || updatedTask.title == "") {
        console.log("title missing to update task");
        return res.status(400).json({ message: "title missing" });
    }

    if (!updatedTask.description) {
        console.log("description missing to update task");
        return res.status(400).json({ message: "desription missing" });
    }

    if (!updatedTask.creator) {
        console.log("creator missing to update task");
        return res.status(400).json({ message: "creator missing" });
    }

    tasks = tasks.map(task => {
        if (task.id == id) {
            return { ...task, ...updatedTask };
        }
        return task;
    });

    console.log("task updated");
    res.status(200).send(updatedTask);
});

router.delete('/tasks/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;

    const findTask = tasks.find(task => task.id == id);
    if (!findTask) {
        console.log("no task with defined id found");
        res.setHeader("Content-Type", "application/json");
        return res.status(404).json({ message: "no task with this id found" });
    }

    tasks = tasks.filter(task => task.id != id);
    console.log("deleted task");
    res.sendStatus(204);
});

module.exports = router;