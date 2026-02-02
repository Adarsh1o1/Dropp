const { connect } = require("mongoose");

async function connectToDb(url) {
  return connect(url);
}

module.exports = { connectToDb };
