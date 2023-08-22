'use strict';

const express = require('express'); //built in function for code running in the Node runtime.

const server = express(); //create our express server, now we are ready to define some functionality.

server.get('/weather', (request, response) => {
  console.log('We got the weather report!')
  response.send('Hello World!')
});
// server.post()
// server.put()

server.listen(3001, () => {
  console.log('Server is listening!');
})