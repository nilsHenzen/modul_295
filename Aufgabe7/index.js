const express = require('express');
const app = express();
const port = 3000;
const basicAuth = require('express-basic-auth');

const auth = basicAuth({
  users: { 'zli': 'zli1234' },
  challenge: true,
  unauthorizedResponse: (req) => 'Unauthorized'
});

app.use('/private', auth);

app.get('/public', (request, response) => {
    response.send("public site");
});

app.get('/private', (request, response) => {
  response.send("private site");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});