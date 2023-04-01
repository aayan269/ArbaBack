const mongoose = require("mongoose");
const dotenv = require('dotenv').config()
const MONGO = process.env.MONGODB_URL
mongoose.set('strictQuery', false)
const connect = mongoose.connect(`${MONGO}`,
{ useUnifiedTopology: true, useNewUrlParser: true })

.then(() => console.log("Connected to DataBase"))
  .catch((err) => console.log(err.message));

module.exports =  connect
