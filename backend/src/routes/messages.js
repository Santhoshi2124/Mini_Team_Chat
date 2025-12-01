const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch (err) { res.status(401).json({ msg: 'Invalid token' }); }
}

router.get('/:channelId', auth, async (req, res) => {
  const { channelId } = req.params;
  const limit = parseInt(req.query.limit || '20', 10);
  const before = req.query.before ? new Date(req.query.before) : new Date();
  const msgs = await Message.find({ channel: channelId, timestamp: { $lt: before } })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('sender', 'name')
    .lean();
  res.json(msgs.reverse());
});

module.exports = router;
