'use strict';

module.exports = {
  mongo_url: process.env.MONGO_URI || 'mongodb://localhost:27017/events',
  port: int(process.env.PORT) || 5000
};

function bool(str) {
  if (str == void 0) return false;
  return str.toLowerCase() === 'true';
}

function int(str) {
  if (!str) return 0;
  return parseInt(str, 10);
}

function float(str) {
  if (!str) return 0;
  return parseFloat(str, 10);
}