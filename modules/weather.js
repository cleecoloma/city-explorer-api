'use strict';

const axios = require('axios');
const dotenv = require('dotenv');
let cache = require('./cache.js');

dotenv.config();
const WEATHER_API_KEY = process.env.WEATHER_KEY;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

const weatherDataRetrieve = (response) => {
  const cityWeatherData = [];
  for (let i = 0; i < 5; i++) {
    const forecast = new Forecast(
      response.data[i].valid_date,
      response.data[i].weather.description
    );
    cityWeatherData.push(forecast);
  }
  return cityWeatherData;
};

const handleGetWeather = async (request, response) => {
  const { lat, lon } = request.query;
  const key = 'weather-' + lat + lon;
  let sendWeatherDataToClient = null;
  if (!lat || !lon) {
    response.status(400).send('Weather:400: Something went wrong!');
  } else {
    console.log('Located before weatherbit get request');
    if (
      cache[key] &&
      Date.now() - cache[key].timestamp < 50000
    ) {
      console.log('Cache hit! Sending stored data!');
      sendWeatherDataToClient = cache[key].data;
    } else {
      try {
        console.log('Cache miss! Requesting fresh API data!');
        let weatherResponse = await axios.get(
          `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lon=${lon}&lat=${lat}`
        );
        sendWeatherDataToClient = weatherDataRetrieve(weatherResponse.data);
        cache[key] = {};
        cache[key].data = sendWeatherDataToClient;
        cache[key].timestamp = Date.now();
      } catch (error) {
        console.log(`Weather: Didn't load get request`, error);
        response.status(500).send('Weather:500: Something went wrong!');
      }
    }
  }
  response.send(sendWeatherDataToClient);
};

module.exports = handleGetWeather;
