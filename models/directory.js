const mongoose = require("mongoose");

const Directory = mongoose.model(
  "Directory",
  new mongoose.Schema({
    type:String,
   name: String,
   contents: []
  })
);

module.exports = Directory;