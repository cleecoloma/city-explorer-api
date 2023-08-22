'use strict';

const dotenv = require('dotenv');
const express = require('express'); //built in function for code running in the Node runtime.
const cors = require('cors');

dotenv.config();
const PORT = process.env.PORT;

const server = express(); //create our express server, now we are ready to define some functionality.
server.use(cors()); //activates cross-origin-resource-sharing

server.get('/weather', (request, response) => {
  console.log('We got the weather report!')
  response.send('Hello World!')
});
// server.post()
// server.put()

server.listen(PORT, () => {
  console.log('Server is listening!');
})