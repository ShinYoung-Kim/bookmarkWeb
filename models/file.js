const mongoose = require("mongoose");

const File = mongoose.model(
  "File",
  new mongoose.Schema({
    type:String,
   name: String,
   link: String,
   location: String,
   imageLink: String,
   memo: String,
   date: Date
  })
);

module.exports = File;