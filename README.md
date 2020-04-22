# FacebookStrategy(Passport) in Node js

> Simple app uses Passport's Facebook Strategy and Node js for login

***SCREENSHOTS***

[![INSERT YOUR GRAPHIC HERE](https://i.imgur.com/PcBJrXC.png)]()

- Click `Login using Facebook` or `Login` in Navbar

[![INSERT YOUR GRAPHIC HERE](https://i.imgur.com/9vw5nrt.png)]()

- Fill up form to login using facebook

[![INSERT YOUR GRAPHIC HERE](https://i.imgur.com/eI3GqMu.png)]()

- After logging in, it will display your name based on your facebook name.

---

## Table of Contents 

- [Installation](#installation)
- [Setup](#setup)
- [Features](#features)

---

## Installation

- Install <a href="https://nodejs.org/en/download/" target="_blank">Node.js</a> and <a href="https://www.mongodb.com/download-center/community" target="_blank">MongoDB</a> in your PC and choose proper OS based on your PC.
- Create an app in <a href="https://developers.facebook.com/" target="_blank">Facebook for Developers</a> to get ID and secret. These will be used later for Facebook Strategy.

[![INSERT YOUR GRAPHIC HERE](https://i.imgur.com/WJitVai.png)]()

### Clone

- Clone this repo to your local machine using `https://github.com/tawbuts/FacebookStrategy-in-nodejs.git`

## Setup

- Follow these instructions to start the app. Use terminal or powershell or command prompt to start the following commands.

> Open terminal to and run command to start the server.

```shell
$ mongod
```

> Open another terminal and install packages. 

```shell
$ npm install
```

> Now get your App ID and App Secret and put it in `configs/keys_util.js`

```javascript
module.exports = {
  FACEBOOK_APP_ID: "", // Paste your App ID here
  FACEBOOK_APP_SECRET: "", // Paste your APP Secret Here
  callbackURL: "http://localhost:4000/auth/facebook/callback", // Put your callback url here 
  MY_SECRET: "Your secret here",
  mongoURI: {
    dev: "mongodb://localhost/fb-node-dev",
    prod: "",
  },
};
```

> Start the server

```shell
$ npm run start
```

- Now open the app in `http://localhost:4000`

## Features

- When using Passport's FacebookStrategy, after logging in or cancelling in facebook. It will leave url extra string `=_+_`. I remove this bug by adding extra script in `public/js/script.js` which I found <a href="https://github.com/jaredhanson/passport-facebook/issues/12" target="_blank">here</a>

- It prevents from going back after login and logout by adding this codes and middlewares

```javascript

...

app.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

...

function checkIfAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to logged in first");
  res.redirect("/");
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    next();
  }
}

...

```
