import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { scoreCard } from '../utils/constants.mjs';

const app = express();
const httpServer = new createServer(app); // we need to pass the express instance to the http server instance to use express app with socket.io because socket.io is only bind with http server instance
const io = new Server(httpServer); // we cann't pass the express instance to the socket.io. only http server instance is allowed 
const port = process.env.PORT || 3000;

// cors middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// write the express logic here
app.get('/', (req, res) => {
  res.send('Hello World!');
});

/* socket.io use the concept of event emitters.
 *  you can send and receive any events you want, with any data you want. 
 */

// socket.io listen on the connection event for incoming sockets and log it to the console.
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // create a event 'send-message' and receive the data from all the connected sockets
  socket.on('send-message', (data) => {
    console.log('user sent a message',data);
    scoreCard.push({ ...data, socketId: socket.id }); // add the data to the scoreCard array
    console.log(scoreCard);
    socket.emit('send-message-response', scoreCard); // call the event 'send-message-response' and send the data to all the connected sockets
  });

  // send the data to all the connected sockets
  socket.on('send-data', () => { 
    socket.emit('send-message-response', scoreCard); 
    console.log('send data');
  });

  // update the data in the scoreCard array
  socket.on('update-message', (data) => {
    const index = scoreCard.findIndex((item) => item.id === data.id);
    scoreCard[index] = { ...scoreCard[index], ...data };
    console.log(scoreCard[index]);
    socket.emit('send-message-response', scoreCard); // call the event 'send-message-response' and send the data to all the connected sockets
  });

  // delete the data from the scoreCard array
  socket.on('delete-message', (data) => {
    const index = scoreCard.findIndex((item) => item.id === data.id);
    scoreCard.splice(index, 1);
    console.log(scoreCard);
    socket.emit('send-message-response', scoreCard); // call the event 'send-message-response' and send the data to all the connected sockets
  });
    
});


// we must listen on the http server instance because socket.io is bind to the http server not express instance
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
