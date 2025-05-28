// src/server.js

const app = require('./app');
const { consumeQueue } = require('./queue/consumer');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
  consumeQueue();
});