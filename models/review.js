// require mongoose
const mongoose = require('mongoose');

// shortcut to reference Schema
const Schema = mongoose.Schema;

// I don't have to do mongoose.schema, because I have the variable  
//(it's like a shorthand)
// REMEMBER! These are validations. How the object should be
// constructed (in this case the review)
const ReviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
});

// Syntax is model(name, schema)
module.exports = mongoose.model('Review', ReviewSchema);

//Model is basically what I want the data to look like