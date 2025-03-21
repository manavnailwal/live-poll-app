const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let currentPoll = {
  question: '',
  options: [],
  votes: []
};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send current poll data when a new client connects
  if (currentPoll.question) {
    socket.emit('pollData', currentPoll);
  }

  // Handle poll creation
  socket.on('createPoll', (pollData) => {
    currentPoll = {
      question: pollData.question,
      options: pollData.options,
      votes: new Array(pollData.options.length).fill(0)
    };
    io.emit('pollData', currentPoll);
    console.log('New poll created:', currentPoll);
  });

  // Handle voting
  socket.on('vote', (index) => {
    if (currentPoll.votes[index] !== undefined) {
      currentPoll.votes[index]++;
      io.emit('pollData', currentPoll);
      console.log('Vote registered for option index:', index);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
