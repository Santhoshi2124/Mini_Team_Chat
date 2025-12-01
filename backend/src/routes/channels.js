const express = require('express');
const router = express.Router();
const Channel = require('../models/Channel');
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

router.get('/', auth, async (req, res) => {
  const channels = await Channel.find().select('-members').lean();
  res.json(channels);
});

router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ msg: 'Name required' });
  let ch = await Channel.findOne({ name });
  if (ch) return res.status(400).json({ msg: 'Channel exists' });
  ch = new Channel({ name, members: [req.user.id] });
  await ch.save();
  res.json(ch);
});

module.exports = router;
