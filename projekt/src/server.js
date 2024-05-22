const express = require('express');
const app = express();
const session = require('express-session');
const port = 3000;
const tasks = require('./tasks');
const authorization = require('./authorization');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use('/swagger', swaggerUi.serve);
app.get('/swagger', swaggerUi.setup(swaggerDocument));


app.use(express.json());

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));

app.use('/', tasks);
app.use('/', authorization);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});