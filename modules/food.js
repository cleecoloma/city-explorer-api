'use strict';

const axios = require('axios');
const dotenv = require('dotenv');
let cache = require('./cache.js');

dotenv.config();
const FOOD_API_KEY = process.env.FOOD_KEY;

class Forecast {
  constructor(name, url, reviewCount, rating, displayAddress) {
    this.name = name;
    this.url = url;
    this.reviewCount = reviewCount;
    this.rating = rating;
    this.displayAddress = displayAddress;
  }
}

const headers = {
  Authorization: `Bearer ${FOOD_API_KEY}`,
};

const foodDataRetrieve = (response) => {
  const cityFoodData = [];
  for (let i = 0; i < 5; i++) {
    const food = new Food(
      response.data[i].businesses.name,
      response.data[i].businesses.url,
      response.data[i].businesses.review_count,
      response.data[i].businesses.rating,
      response.data[i].businesses.display_address
    );
    cityFoodData.push(forecast);
  }
  return cityFoodData;
};

const handleGetFood = async (request, response) => {
  const { lat, lon } = request.query;
  const key = 'food-' + lat + lon;
  let sendFoodDataToClient = null;
  if (!lat || !lon) {
    response.status(400).send('Food:400: Something went wrong!');
  } else {
    console.log('Located before food get request');
    if (cache[key] && Date.now() - cache[key].timestamp < 50000) {
      console.log('Cache hit! Sending stored data!');
      sendFoodDataToClient = cache[key].data;
    } else {
      try {
        console.log('Cache miss! Requesting fresh API data!');

        let foodResponse = await axios.get(
          `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}&categories=foodtrucks&sort_by=rating&limit=5&radius=750`,
          { headers }
        );
        sendFoodDataToClient = foodDataRetrieve(foodResponse.data);
        cache[key] = {};
        cache[key].data = sendFoodDataToClient;
        cache[key].timestamp = Date.now();
      } catch (error) {
        console.log(`Food: Didn't load get request`, error);
        response.status(500).send('Food:500: Something went wrong!');
      }
    }
  }
  response.send(sendFoodDataToClient);
};

module.exports = handleGetFood;
