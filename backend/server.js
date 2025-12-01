require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const authRoutes = require('./src/routes/auth');
const channelRoutes = require('./src/routes/channels');
const messageRoutes = require('./src/routes/messages');
const { authenticateSocket } = require('./src/middlewares/authSocket');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);

// Basic presence map: userId -> socketId(s)
const onlineUsers = new Map();

io.use(async (socket, next) => {
  try {
    await authenticateSocket(socket, next);
  } catch (err) {
    next(err);
  }
});

io.on('connection', (socket) => {
  const user = socket.user; // set in authSocket
  if (!user) return;
  // add socket to user's set
  const prev = onlineUsers.get(user.id) || new Set();
  prev.add(socket.id);
  onlineUsers.set(user.id, prev);

  // broadcast presence
  io.emit('presence:update', Array.from(onlineUsers.keys()));

  socket.on('joinChannel', (channelId) => {
    socket.join(channelId);
  });

  socket.on('leaveChannel', (channelId) => {
    socket.leave(channelId);
  });

  socket.on('message:create', async (payload) => {
    // payload: { channelId, text }
    const Message = require('./src/models/Message');
    const MessageModel = new Message({
      sender: user.id,
      channel: payload.channelId,
      text: payload.text,
      timestamp: new Date()
    });
    await MessageModel.save();
    io.to(payload.channelId).emit('message:new', {
      _id: MessageModel._id,
      sender: { _id: user.id, name: user.name },
      channel: payload.channelId,
      text: payload.text,
      timestamp: MessageModel.timestamp
    });
  });

  socket.on('disconnect', () => {
    const set = onlineUsers.get(user.id);
    if (set) {
      set.delete(socket.id);
      if (set.size === 0) onlineUsers.delete(user.id);
      else onlineUsers.set(user.id, set);
    }
    io.emit('presence:update', Array.from(onlineUsers.keys()));
  });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { })
  .then(()=> {
    server.listen(PORT, ()=> console.log('Server running on', PORT));
  })
  .catch(err => console.error('MongoDB connect error', err));
