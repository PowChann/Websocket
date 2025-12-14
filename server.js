require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const connectDB = require('./config/db');
const Message = require('./models/Message');
const User = require('./models/User');
const mongoose = require('mongoose');

// 1. Connect to MongoDB
connectDB();

// 2. Configure EJS & Static Files
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 3. In-memory Storage (for active session data)
const ROOM_NAME = 'Lobby';
const onlineUsers = new Map(); // username -> { socketId, color }

// Helper: Random Color Generator
const generateColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8B88B', '#FAD7A0'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// 4. Routes
app.get('/', (req, res) => {
  res.render('index');
});

// 5. WebSocket Logic
io.on('connection', (socket) => {
  console.log(`[+] Client connected: ${socket.id}`);

  let currentUsername = null;
  let userColor = null;

  // -- Event: User Joins Lobby --
  socket.on('join-lobby', async ({ username }) => {
    currentUsername = username;
    socket.join(ROOM_NAME);

    // Assign Color (Persist if DB is on, else random)
    userColor = generateColor();

    if (mongoose.connection.readyState === 1) {
      try {
        let user = await User.findOne({ username });
        if (!user) {
          user = await User.create({ username, color: userColor });
          console.log(`[DB] New user created: ${username}`);
        } else {
          user.lastSeen = new Date();
          await user.save();
          userColor = user.color; // Use saved color
        }
      } catch (err) {
        console.error('DB Error on Join:', err.message);
      }
    }

    // Update Memory & Notify Client
    onlineUsers.set(username, { socketId: socket.id, color: userColor });
    socket.emit('your-color', { color: userColor });

    // Broadcast Join
    io.to(ROOM_NAME).emit('users-update', Array.from(onlineUsers.entries()).map(([name, data]) => ({
      username: name,
      color: data.color
    })));

    // Send Chat History
    if (mongoose.connection.readyState === 1) {
      const messages = await Message.find().sort({ timestamp: -1 }).limit(50).lean();
      messages.reverse().forEach(msg => {
        socket.emit('chat-message', {
          username: msg.username,
          message: msg.message,
          color: onlineUsers.get(msg.username)?.color
        });
      });
    }
  });

  // -- Event: Cursor Movement --
  socket.on('cursor-move', (data) => {
    if (!currentUsername) return;
    // Broadcast to others (exclude sender)
    socket.to(ROOM_NAME).emit('cursor-update', {
      username: currentUsername,
      x: data.x,
      y: data.y,
      color: userColor
    });
  });

  // -- Event: Chat Message --
  socket.on('chat-message', async (data) => {
    if (!currentUsername || !data.message) return;

    const msgData = {
      username: currentUsername,
      message: data.message.trim(),
      color: userColor
    };

    // Broadcast immediately
    io.to(ROOM_NAME).emit('chat-message', msgData);

    // Save to DB (Async)
    if (mongoose.connection.readyState === 1) {
      await Message.create({ username: currentUsername, message: msgData.message });
    }
  });

  // -- Event: Disconnect --
  socket.on('disconnect', () => {
    if (currentUsername) {
      console.log(`[-] Client disconnected: ${currentUsername}`);
      onlineUsers.delete(currentUsername);

      // Notify removal
      io.to(ROOM_NAME).emit('users-update', Array.from(onlineUsers.entries()).map(([name, data]) => ({
        username: name,
        color: data.color
      })));
      io.to(ROOM_NAME).emit('cursor-remove', { username: currentUsername });
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO initialized`);
  console.log(`💾 Database Mode: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Memory Only (Fallback)'}\n`);
});
