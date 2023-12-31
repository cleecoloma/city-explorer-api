'use strict';
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const handleGetMovies = require('./modules/movies.js');
const handleGetWeather = require('./modules/weather.js');
const handleGetFood = require('./modules/food.js');

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(cors());

app.get('/weather', handleGetWeather);
app.get('/movie', handleGetMovies);
app.get('/food', handleGetFood);

app.listen(PORT, () => {
  console.log('Server is listening on port ::: ' + PORT);
});
