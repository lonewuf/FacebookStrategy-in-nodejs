module.exports = {
  FACEBOOK_APP_ID: "550161245638140",
  FACEBOOK_APP_SECRET: "115da7688100073695e2c2af748ef94c",
  callbackURL: "https://app-fb-node.herokuapp.com/auth/facebook/callback",
  MY_SECRET: "my special secret",
  mongoURI: {
    dev: "mongodb://localhost/fb-node-dev",
    prod: "mongodb://nico:niconicon1@ds111072.mlab.com:11072/fb-node-prod",
  },
};
