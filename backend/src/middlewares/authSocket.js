const jwt = require('jsonwebtoken');

async function authenticateSocket(socket, next) {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('No token'));
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: data.id, name: data.name };
    next();
  } catch (err) { next(new Error('Auth error')); }
}

module.exports = { authenticateSocket };
