const express = require('express');
const app = express();
const session = require('express-session');
const port = 3000;
const mail = "zli";
const password = "m295";
const books = require('./books');
const lends = require('./lends');

app.use(express.json());

app.use(session({
    secret: 'abc123',
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));

app.use("/", books);
app.use('/', lends);

app.post('/login', (req, res) => {
    const credentials = atob(req.headers.authorization.replace("Basic ", "")).split(":");
    if (credentials[0] === mail && credentials[1] === password) {
        req.session.mail = credentials[0];
        req.session.authenticated = true;
        res.sendStatus(201);
    } else {
        res.send(401);
    }
});

app.get('/verify', (req, res) => {
    if (req.session.authenticated) {
        res.status(200).json({ email: req.session.mail, statusCode: 200 });
    } else {
        res.status(401).send('Unauthorized');
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