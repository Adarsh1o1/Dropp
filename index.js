const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const { connectToDb } = require("./connection");
const { logReqRes } = require("./middlewares/log");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 8000;

connectToDb("mongodb+srv://adarshkushawha52_db_user:tQRxfzBS2SroX3DW@dropp.80z14dt.mongodb.net/?appName=Dropp").then(()=> console.log("MongoDb connected!"));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve("./public")));
app.use(logReqRes("log.txt"));

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
