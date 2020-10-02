const cors = require('cors');
require('dotenv').config()
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const socketio = require('socket.io');

const Message = require('./models/message');

const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

io.on("connection", socket => {
  let roomId;
  console.log('connected');
  

  socket.on('joinroom', data => {
    roomId = data.id
    socket.join(roomId);
    console.log(io.sockets.adapter.rooms[roomId])
  }); 
  
  socket.on('update', async data => {
    console.log(data)
    console.log(io.sockets.adapter.rooms[roomId])
    const {senderId, messages} = data;
      const sendTo = messages.users.filter(i => i !== senderId)[0];
      socket.to(sendTo).emit('newMessage', data.newMessage)
  });
  
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
  })

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const schedulerRoutes = require('./routes/schedule');

app.use('/auth', authRoutes);
app.use(userRoutes);
app.use('/api/schedules', schedulerRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
      message: message,
      data: data
  })
})

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then(() => {
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
})
.catch(err => console.log(err))



// delete button contact (done)

// refresh causes loss of data // state is lost

// first message to new user??

// style

// schedule page freaks out after being pushed to home from signup

// add schedule page

// remove favourites
// approve contact addition 
// share schedule 