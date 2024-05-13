const express = require('express');
const app = express();
const port = 3000;


app.get('/temperatur', async (req, res) => {
    const plz = req.query.plz;
    const apiUrl = `https://app-prod-ws.meteoswiss-app.ch/v1/plzDetail?plz=${plz}00`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch data from API');
        } else {
            const data = await response.json();
            const temperatur = data.currentWeather.temperature;
            res.send("Die aktuelle Temperatur in der PLZ " + plz + " ist: " + temperatur);
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
