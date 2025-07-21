const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware to allow cross-origin requests (for the frontend)
app.use(cors());

// API key and base URL for OpenWeatherMap API
const apiKey = '5bc06f50ea4133a580ffe081f9969b09'; // Replace with your OpenWeatherMap API key
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastBaseUrl = 'https://api.openweathermap.org/data/2.5/forecast';

// Endpoint to get current weather data
app.get('/weather', async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).send({ error: 'City is required' });
    }

    try {
        const response = await axios.get(weatherBaseUrl, {
            params: {
                q: city,
                appid: apiKey,
                units: 'metric'
            }
        });

        res.json(response.data); // Send weather data to the frontend
    } catch (error) {
        res.status(500).send({ error: 'Error fetching weather data' });
    }
});

// Endpoint to get weather forecast data
app.get('/forecast', async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).send({ error: 'City is required' });
    }

    try {
        const response = await axios.get(forecastBaseUrl, {
            params: {
                q: city,
                appid: apiKey,
                units: 'metric'
            }
        });

        res.json(response.data); // Send forecast data to the frontend
    } catch (error) {
        res.status(500).send({ error: 'Error fetching forecast data' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
