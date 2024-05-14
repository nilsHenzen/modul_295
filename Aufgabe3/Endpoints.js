const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const names = ["Anna", "Berta", "Carl", "David", "Eva", "Felix", "Greta", "Hans", "Ida", "Julia", "Klaus", "Lena", "Max", "Nora", "Otto", "Paula", "Rainer", "Sabine", "Thomas", "Ursula"];
const meJson = {
  "Vorname": "Nils",
  "Nachname": "Henzen",
  "Alter": 18,
  "Wohnort": "Bachenbülach",
  "Augenfarbe": "Braun"
}


app.get('/now', (request, response) => {
  const currentDate = new Date();
  response.send('current time is: ' + currentDate.getHours() + ":" + currentDate.getMinutes());
});

app.get('/zli', (request, response) => {
  const url = "https://www.zli.ch/";
  response.redirect(url);
});

app.get('/name', (request, response) => {
  const randomNumber = Math.floor(Math.random() * 20);
  const name = names[randomNumber];
  response.send(name);
});

app.get('/html', (request, response) => {
  response.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/image', (request, response) => {
  response.sendFile(path.join(__dirname, '/image.jpg'));
});

app.get('/teapot', (request, response) => {
  response.sendStatus(418);
});

app.get('/user-agent', (request, response) => {
  const browser = request.headers['user-agent'];
  response.send(browser);
});

app.get('/secret', (request, response) => {
  response.sendStatus(403);
});

app.get('/xml', (request, response) => {
  response.sendFile(path.join(__dirname, '/index.xml'));
});

app.get('/me', (request, response) => {
  response.send(meJson);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});