// require mongoose
const mongoose = require('mongoose');
const Review = require('./review');

// shortcut to reference Schema
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

const opts = { toJSON: { virtuals: true } };

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
})
// I don't have to do mongoose.schema, because I have the variable  
//(it's like a shorthand)
// REMEMBER! These are validations. How the object should be
// constructed (in this case the campground)
const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    }
  ],
  // properties: {
  //   popUpMarkup: ``
  // }
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 20)}...</p>`
  // this.url.replace('/upload', '/upload/w_200');
})

// Delete comments
// MONGOOSE! MIDDLEWARE. Query middleware !document middleware
CampgroundSchema.post('findOneAndDelete', async function (document) {
  if (document) {
    await Review.deleteMany({
      _id: {
        $in: document.reviews,
      }
    })
  };
})

// Syntax is model(name, schema)
module.exports = mongoose.model('Campground', CampgroundSchema);

//Model is basically what I want the data to look like