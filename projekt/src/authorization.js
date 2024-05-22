const express = require('express');
const router = express.Router();
const password = "m295";
const validator = require('validator');

router.post('/login', (req, res) => {
    const credentials = atob(req.headers.authorization.replace("Basic ", "")).split(":");
    res.setHeader("Content-Type", "application/json");
    if (validator.isEmail(credentials[0]) && credentials[1] === password) {
        req.session.mail = credentials[0];
        req.session.authenticated = true;
        console.log("logged in");
        res.status(201).json({ message: "succesfully logged in" });
    } else {
        console.log("failed login");
        res.status(401).json({ message: "wrong credentials" });
    }
});

router.get('/verify', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.session.authenticated) {
        console.log("is logged in");
        res.status(200).json({ email: req.session.mail, session: "valid" });
    } else {
        console.log("is not logged in");
        res.status(401).json({ message: "not logged in" });
    }
});

router.delete('/logout', (req, res) => {
    req.session.authenticated = false;
    req.session.mail = "";
    res.clearCookie('connect.sid');
    console.log("logout");
    res.status(204).send();
});

module.exports = router;