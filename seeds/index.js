// THIS IS THE APP THAT SEEDS DATABASE
const mongoose = require('mongoose');
// IMPORT CITIES ARRAY
const cities = require('./cities');
// IMPORT CAMPGROUND MODEL
const Campground = require('../models/campground');
// IMPORT CAMPGROUND TITLE VARIABLES
const { places, descriptors } = require('./seedHelpers');


// CONNECT OPERATION TO MONGO
mongoose.connect('mongodb://localhost:27017/YelpCamp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

// FUNCTION TO OBTAIN RANDOM ELEMENTS FROM AN ARRAY
const sample = array => array[Math.floor(Math.random() * array.length)];

// THIS WILL SEED THE DATABASE
const seedDB = async () => {

  // WILL DELETE WHAT'S ALREADY THERE
  await Campground.deleteMany({});

  // LOOP 50 TIMES

  for (let i = 0; i < 200; i++){

    // CREATE A RANDOM NUMBER FROM 0 TO 999
    const random1000 = Math.floor(Math.random() * 1000);

    // CREATE RANDOM NUMBERS FROM 0 TO 30?
    const price = Math.floor(Math.random() * 20) + 10;

    // CREATES CAMPGROUND WITH RANDOM LOCATION, STATE AND TITLE
    const camp = new Campground({
      author: '60c91f8469cc4206444271e5',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: 'https://res.cloudinary.com/danbiiooy/image/upload/v1623870719/YelpCamp/obwpwtsfmf9isfwclo5h.jpg',
          filename: 'YelpCamp/obwpwtsfmf9isfwclo5h'
        },
        {
          url: 'https://res.cloudinary.com/danbiiooy/image/upload/v1623870724/YelpCamp/s0duigueyxtl7sawdjrn.jpg',
          filename: 'YelpCamp/s0duigueyxtl7sawdjrn'
        }
      ],
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus excepturi ea doloribus. Odit, corrupti asperiores maxime, magnam assumenda non fugiat dolor dolores nostrum beatae est vitae. Tempore eum molestias dicta!',
      price,
      geometry:
      {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude
        ]
      },
    });
    
    // SAVES TO DATABASE
    await camp.save();
  }
};

// AFTER SEEDING, CLOSE THE CONNECTION
seedDB().then(() => {
  mongoose.connection.close();
});