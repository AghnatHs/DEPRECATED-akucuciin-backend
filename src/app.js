require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { default: rateLimit } = require("express-rate-limit");
const passport = require("passport");

const errorMiddleware = require("./middlewares/error.middleware");
const authRoute = require("./routes/authentication.route");
const customerRoute = require("./routes/customer.route");
const orderRoute = require("./routes/order.route");
const APPCONFIG = require("./configs/app.config");

require("./auth/jwt.auth");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
); 
if (APPCONFIG.isDevelopment) app.set("trust proxy", true);
else app.set("trust proxy", false);
app.use(express.json());

const limiterCooldown = Number(process.env.LIMITER_COOLDOWN);
const limiter = rateLimit({
  windowMs: limiterCooldown * 60 * 1000,
  limit: 80,
  message: {
    success: false,
    errors: `Too many requests, please try again in ${limiterCooldown} minutes`,
  },
});
app.use(limiter);

app.use(passport.initialize());
app.use(authRoute);
app.use(customerRoute);
app.use(orderRoute);
app.use(errorMiddleware);

module.exports = app;
