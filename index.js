'use strict';
const dotenv = require('dotenv');
const express = require('express'); //built in function for code running in the Node runtime.
const cors = require('cors');
const axios = require('axios');

dotenv.config();
const PORT = process.env.PORT;
const WEATHER_API_KEY = process.env.WEATHER_KEY;
const MOVIE_API_KEY = process.env.MOVIE_KEY;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

class Movies {
  constructor(title, overview, averageVotes, totalVotes, imageUrl, popularity, releasedOn) {
    this.title = title;
    this.overview = overview;
    this.averageVotes = averageVotes;
    this.totalVotes = totalVotes;
    this.imageUrl = imageUrl;
    this.popularity = popularity;
    this.releasedOn = releasedOn;
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

const movieDataRetrieve = (response) => {
  const cityMovieData = [];
  for (let i = 0; i < 20; i++) {
    const movies = new Movies(
      response.results[i].title,
      response.results[i].overview,
      response.results[i].vote_average,
      response.results[i].vote_count,
      response.results[i].poster_path,
      response.results[i].popularity,
      response.results[i].release_date
    );
    cityMovieData.push(movies);
  }
  return cityMovieData;
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

app.get('/weather', async (request, response) => {
  const { lat, lon, searchQuery } = request.query;
  console.log('We got the weather report!');
  console.log(request.query);
  debugger;
  if (!lat || !lon || !searchQuery) {
    console.log('here now');
    errorMessage(400);
  } else {
    console.log('Located before weatherbit get request');
    try {
      let weatherResponse = await axios.get(
        `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lon=${lon}&lat=${lat}`
      );
      let sendWeatherDataToClient = weatherDataRetrieve(weatherResponse.data);
      let movieResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${searchQuery}`
      );
      let sendMovieDataToClient = movieDataRetrieve(movieResponse.data);
      response.send({sendWeatherDataToClient, sendMovieDataToClient});
    } catch (error) {
      console.log(`Error: didn't load get request`, error);
      response.status(500).send('Something went wrong!');
    }
  }
});

app.listen(PORT, () => {
  console.log('Server is listening on port ::: ' + PORT);
});
