// src/app.js

require('dotenv').config();
const express = require('express');
const app = express();

const messageRoutes = require('./routes/messageRoutes');

app.use(express.json());
app.use('/messages', messageRoutes);

module.exports = app;