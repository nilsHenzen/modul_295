const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
let names = ["Anna", "Berta", "Carl", "David", "Eva", "Felix", "Greta", "Hans", "Ida", "Julia", "Klaus", "Lena", "Max", "Nora", "Otto", "Paula", "Rainer", "Sabine", "Thomas", "Ursula"];
let meJson = {
    "Vorname": "Max",
    "Nachname": "Muster",
    "Alter": 18,
    "Wohnort": "züri",
    "Augenfarbe": "Blau"
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/now', (request, response) => {

    const currentTimeZone = request.query.tz;
    const now = new Date();
    const options = {
        timeZone: currentTimeZone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat('de-CH', options);
    const currentTime = formatter.format(now);

    response.send('current time is: ' + currentTime );
});

app.post('/names', (request, response) => {
    const newName = request.body.Name;

    names.push(newName);
    response.status(201).send(names);
});

app.get('/names', (request, response) => {
    response.send(names);
})

app.delete('/names', (request, response) => {
    const deleteName = request.query.name;

    names = names.filter((name) => name !== deleteName);
    
    response.status(204).send(names);
});

app.get('/secret2', (request, response) => {
    const header = request.headers.authorization;
    if (header == "Basic aGFja2VyOjEyMzQ=") {
        response.sendStatus(200);
    } else {
        response.sendStatus(401);
    }
})

app.get('/chuck', async (request, response) => {
    const apiUrl = "https://api.chucknorris.io/jokes/random";
    const username = request.query.name;

    try {
        const dataresponse = await fetch(apiUrl);
        if (!dataresponse.ok) {
            throw new Error('Failed to fetch data from API');
        } else {
            const data = await dataresponse.json();
            const joke = data.value;
            const searchValue = "Chuck Norris";

            const newjoke = joke.replace(searchValue, username)
            response.send(newjoke);
        }
    } catch (error) {
        console.log(error.message)
        response.status(500).json({ error: 'Internal server error' });
    }
})

app.patch('/me', (request, response) => {
    const newData = request.body;

    Object.keys(newData).forEach(key => {
        if (meJson.hasOwnProperty(key)) {
            meJson[key] = newData[key];
        }
    });

    response.send(meJson);
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});