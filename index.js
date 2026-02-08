require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const collectionRouter = require("./routes/collection");
const { connectToDb } = require("./connection");
const { logReqRes } = require("./middlewares/log");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;
const mongo_url = process.env.MONGO_URL;

connectToDb(mongo_url).then(()=> console.log("MongoDb connected!"));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve("./public")));
app.use(logReqRes("log.txt"));

app.use("/user", userRouter);
app.use("/c", collectionRouter);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
