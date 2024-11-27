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
    origin: (origin, callback) => {
      if (!APPCONFIG.isDevelopment) {
        callback(null, true);
        return;
      }
      const urlPattern = /^https?:\/\/(www\.)?akucuciin\.com(\/.*)?$/;
      if (urlPattern.test(origin)) {
        !APPCONFIG.isDevelopment ? callback(null, true) : callback(null, true);
      } else {
        !APPCONFIG.isDevelopment
          ? callback(null, true)
          : callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.set("trust proxy", false);
app.use(express.json());

app.use(passport.initialize());
app.use(authRoute);
app.use(customerRoute);
app.use(orderRoute);
app.use(errorMiddleware);

module.exports = app;
