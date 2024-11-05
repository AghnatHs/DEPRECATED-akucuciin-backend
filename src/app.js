require("dotenv").config();
const express = require("express");
const { default: rateLimit } = require("express-rate-limit");
const passport = require("passport");

const errorMiddleware = require("./middlewares/error.middleware");
const authRoute = require("./routes/authentication.route");
const customerRoute = require("./routes/customer.route");

require("./auth/jwt.auth");

const app = express();
app.use(express.json());

const limiterCooldown = Number(process.env.LIMITER_COOLDOWN);
const limiter = rateLimit({
  windowMs: limiterCooldown * 60 * 1000,
  limit: 150,
  message: {
    success: false,
    errors: `Too many requests, please try again in ${limiterCooldown} minutes`,
  },
});
app.use(limiter);

app.use(passport.initialize());
app.use(authRoute);
app.use(customerRoute);
app.use(errorMiddleware);

module.exports = app;
