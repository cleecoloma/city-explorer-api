'use strict';

const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const MOVIE_API_KEY = process.env.MOVIE_KEY;

class Movies {
  constructor(
    title,
    overview,
    averageVotes,
    totalVotes,
    imageUrl,
    popularity,
    releasedOn
  ) {
    this.title = title;
    this.overview = overview;
    this.averageVotes = averageVotes;
    this.totalVotes = totalVotes;
    this.imageUrl = imageUrl;
    this.popularity = popularity;
    this.releasedOn = releasedOn;
  }
}

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
const handleGetMovies = async (request, response) => {
  const searchQuery = request.query.searchQuery;
  if (!searchQuery) {
    response.status(400).send('Movies:400: Something went wrong!');
  } else {
    console.log('Located before movies get request');
    try {
      let movieResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${searchQuery}`
      );
      let sendMovieDataToClient = movieDataRetrieve(movieResponse.data);
      response.send(sendMovieDataToClient);
    } catch (error) {
      console.log(`Movies: Didn't load get request`, error);
      response.status(500).send('Movies:500: Something went wrong!');
    }
  }
};

module.exports = handleGetMovies;
