// require mongoose
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// shortcut to reference Schema
const Schema = mongoose.Schema;

// Now I don't have to do mongoose.schema, because I have the variable  
//(it's like a shorthand)
// REMEMBER! These are validations. How the object should be
// constructed (in this case the user)
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  }
});

// ADDS TO A SCHEMA A USERNAME, A PASSWORD, MAKES SURE THEY ARE UNIQUE NOT DUPLICATED
// AND SOME NEW METHODS
// DOCS DON'T MAKE IT VERY CLEAR
UserSchema.plugin(passportLocalMongoose);

// Syntax is model(name, schema)
module.exports = mongoose.model('User', UserSchema);

//Model is basically what I want the data to look like