const mongoose = require("mongoose");

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function connectToDb(uri) {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
  }
  catch (error){
    console.log(error);
  }
}

module.exports = { connectToDb };
