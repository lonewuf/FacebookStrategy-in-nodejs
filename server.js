// Import all packages needed
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const FacebookStrategy = require("passport-facebook").Strategy;

// Import schema
const User = require("./models/user");

const app = express();
// Get all keys
const keys = require("./configs/keys_utils");

// Setup mongodb
mongoose
  .connect(keys.mongoURI.dev, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database is running"))
  .catch((err) => console.log(`Database Error: ${err}`));

// Serves resources in public folder
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as templating engine
app.set("view engine", "ejs");

// Setup passport, session and facebook strategy
app.use(
  session({
    secret: keys.MY_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new FacebookStrategy(
    {
      clientID: keys.FACEBOOK_APP_ID,
      clientSecret: keys.FACEBOOK_APP_SECRET,
      callbackURL: keys.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ facebook_id: profile.id });
        if (user) {
          done(null, user);
        } else {
          // If no user found in db create user
          // Get user data from facebook "profile"
          const newUser = await User.create({
            name: profile.displayName,
            facebook_id: profile.id,
          });
          // save user
          await newUser.save();
          done(null, newUser);
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);
// Serialize user
passport.serializeUser(function (user, done) {
  // Pass the id of user and save it to session
  done(null, user._id);
});
// Deserialize user
passport.deserializeUser(function (id, done) {
  // Check the id of user and save it to request as req.user
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null));
});
// Setup flash message
app.use(flash());
app.use(function (req, res, next) {
  (res.locals.error = req.flash("error")), next();
});

// Setup server to disable going back after login and logout
app.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

//// ROUTES

//  @route  GET
//  @desc   Landing page of website
//  @access Public
app.get("/", isLoggedIn, (req, res) => {
  const user = req.user;
  res.render("index", {
    user,
  });
});

//  @route  GET
//  @desc   Route for redirecting in facebook login page
//  @access Public
app.get("/auth/facebook", passport.authenticate("facebook"));

//  @route  GET
//  @desc   Route after logging in facebook
//  @access Public
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successReturnToOrRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash:
      "You can't proceed without logging in. Login first to proceed",
  })
);

//  @route  GET
//  @desc   Dashboard for successful login
//  @access Private
app.get("/dashboard", checkIfAuthenticated, (req, res) => {
  const user = req.user;
  res.render("dashboard", { user });
});

//  @route  GET
//  @desc   Logout user
//  @access Public
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Check if user already authenticated
function checkIfAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to logged in first");
  res.redirect("/");
}

// Disables accessing login page after logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    next();
  }
}

// Setup port
const port = process.env.PORT || 4000;
// Start server
app.listen(port, () => console.log(`Server is running on port ${port}`));
