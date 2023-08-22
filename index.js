'use strict';
import weather from './data/weather.json';

const dotenv = require('dotenv');
const express = require('express'); //built in function for code running in the Node runtime.
const cors = require('cors');

dotenv.config();
const PORT = process.env.PORT;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

const app = express(); //create our express app, now we are ready to define some functionality.
app.use(cors()); //activates cross-origin-resource-sharing. It will allow other origins (besides localhost to make request to this code)

app.get('/weather', (request, response) => {
  console.log(request.query);
  console.log('We got the weather report!');

  if (!request.query.search) {
    response.status(400).send('Bad Request');
  } else {
    response.status(200).send('Hello World!');
  }
});
// app.post()
// app.put()

app.listen(PORT, () => {
  console.log('Server is listening!');
});
