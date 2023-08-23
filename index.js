'use strict';
const dotenv = require('dotenv');
const express = require('express'); //built in function for code running in the Node runtime.
const cors = require('cors');
const dataWeather = require('./data/weather.json');
const axios = require('axios');

const PORT = process.env.PORT;
const WEATHER_API_KEY = process.env.WEATHER_KEY;

dotenv.config();

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

const dataRetrieve = (response) => {
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

const errorMessage = (errorCode) => {
  if (errorCode === 400) {
    return response
      .status(errorCode)
      .send(
        "Bad Request. Server cannot process client's request due to client error."
      );
  } else {
    return response
      .status(errorCode)
      .send(
        "Unexpected condition was encountered. Server couldn't fulfill the request."
      );
  }
};

const app = express(); //create our express app, now we are ready to define some functionality.
app.use(cors()); //activates cross-origin-resource-sharing. It will allow other origins (besides localhost to make request to this code)

app.get('/weather', (request, response) => {
  const { lat, lon, searchQuery } = request.query;
  console.log('We got the weather report!');
  if (!lat || !lon || !searchQuery) {
    errorMessage(400);
  } else {
    try {
      let weatherResponse = axios.get(
        `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lon=${lon}&lat=${lat}`
      );
      let sendWeatherDataToClient = dataRetrieve(weatherResponse);
      response.json(sendWeatherDataToClient);
    } catch (e) {
      response.status(500).send('Something went wrong!');
    }
  }

  // } else {
  //   errorMessage(500);
  // }
  // if (!lat || !lon || !searchQuery) {
  //   errorMessage(400);
  // } else {
  //   if (searchQuery.toLowerCase() === 'seattle') {
  //     response.json(dataRetrieve(0));
  //   } else if (searchQuery.toLowerCase() === 'paris') {
  //     response.json(dataRetrieve(1));
  //   } else if (searchQuery.toLowerCase() === 'amman') {
  //     response.json(dataRetrieve(2));
  //   } else {
  //     errorMessage(500);
  //   }
  // }
});

app.listen(PORT, () => {
  console.log('Server is listening!');
});
