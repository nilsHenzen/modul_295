const express = require('express');
const app = express();
const port = 3000;

const names = ["Hans", "Peter", "Fritz", "Emma", "Mara", "Emil", "Anna", "Otto", "Max", "Peter"]

app.get('/now', (request, response) => {
  const currentDate = new Date();
  response.send('current time is: ' + currentDate.getHours() + ":" + currentDate.getMinutes());
});

app.get('/zli', (request, response) => {
  const url = "https://www.zli.ch/";
  response.redirect(url);
});

app.get('/name', (request, response) => {
  const randomNumber = Math.floor(Math.random() * 10);
  const name = names[randomNumber];
  response.send(name);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});