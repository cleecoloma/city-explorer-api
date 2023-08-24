'use strict';

const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const WEATHER_API_KEY = process.env.WEATHER_KEY;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
};

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
  if (!lat || !lon ) {
    response.status(400).send('Weather:400: Something went wrong!');
  } else {
    console.log('Located before weatherbit get request');
    try {
      let weatherResponse = await axios.get(
        `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lon=${lon}&lat=${lat}`
      );
      let sendWeatherDataToClient = weatherDataRetrieve(weatherResponse.data);
      response.send(sendWeatherDataToClient);
    } catch (error) {
      console.log(`Weather: Didn't load get request`, error);
      response.status(500).send('Weather:500: Something went wrong!');
    }
  }
};

module.exports = handleGetWeather;
