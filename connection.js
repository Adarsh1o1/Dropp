const mongoose = require("mongoose");

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function connectToDb(uri) {
  try {

    await mongoose.connect(uri, clientOptions);
  }
  catch (error){
    console.log(error);
  }
}

module.exports = { connectToDb };
