const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isChecked: { type: Boolean, default: false }, // Make sure isChecked is part of the schema
});

const UsersModel = mongoose.model("todoData", todoSchema); // Define the model

module.exports = UsersModel;
