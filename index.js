if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//BASIC EXPRESS APP TEMPLATE:
// require express
// create app
// require path
// require mongoose
// method override may be optional but necessary
// connect to mongo
// set vieweng to ejs (will probably change with React)
// do the path thing
// express url encoded and method override
// render a basic page on / directory (this is an ejs thing)
// start the app on a port (app.listen(port, callback))
// Add necessary models

// BASIC ENVIRONMENT VARIABLES
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// one of many engines used to parse ejs
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');



// GET ALL ROUTES
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/YelpCamp';
const userRoutes = require('./routes/users');

// CONNECT OPERATION TO MONGO
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

// RUN EXPRESS
const app = express();

// BASIC SETUP FOR EJS AND METHODOVERRIDE
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// MONGO SANITIZE




const secret = process.env.SECRET || 'foo'

app.use(mongoSanitize());
const store = new MongoStore({
  mongoUrl: localDb,
  secret: secret,
  // SECONDS
  touchAfter: 24 * 60 * 60
});

store.on('error', function (e) {
  console.log('ERROR', e);
});

// SESSION SETUP
const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // MILISECONDS
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}
app.use(session(sessionConfig));
// SESSION MUST COME BEFORE INIT SESSION W/PASSPORT

// CONTENT SECURITY POLICY
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/danbiiooy/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://images.unsplash.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);


// PASSPORT SETUP
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
// Serialization is how do we store a user in the session
// OPPOSITE (out of session)
passport.deserializeUser(User.deserializeUser());

// FLASH SETUP
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// CAMPGROUND & REVIEW ROUTES
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

// ROOT DIRECTORY
app.get('/', (req, res) => {
  console.log(req.query)
  res.render('home');
});

// ERROR THROWN WHEN NOTHING IS FOUND
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh no, something went wrong';
  res.status(statusCode).render('error', {err});
})

// APP STARTUP
app.listen(3000, () => {
    console.log('APP RUNNING ON PORT 3000');
});