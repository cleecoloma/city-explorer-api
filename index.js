'use strict';
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const handleGetMovies = require('./movies.js');
const handleGetWeather = require('./weather.js');

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(cors());

app.get('/weather', handleGetWeather);
app.get('/movie', handleGetMovies);

app.listen(PORT, () => {
  console.log('Server is listening on port ::: ' + PORT);
});
