const express = require('express');
const app = express();
const session = require('express-session');
const port = 3000;
app.set('trust proxy', 1)

app.use(express.json());

app.use(session({
  secret: 'abc123',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

let names = []

app.post('/name', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send('Name is required');
    }
    names.push(name);
    req.session.name = name;
    res.send('Name stored');
});
  
app.get('/name', (req, res) => {
    res.send(names);
});
  
app.delete('/name', (req, res) => {
    if (names.length) {
        names = [];
        delete req.session.name;
        return res.send('All names deleted from session');
    }
    res.status(404).send('No names found');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});