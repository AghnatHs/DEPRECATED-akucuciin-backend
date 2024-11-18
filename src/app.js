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

if (APPCONFIG.isDevelopment) app.set("trust proxy", true);
else app.set("trust proxy", false);

app.use(passport.initialize());

// --GOOGLE API
app.post('/add-to-sheet', async (req, res) => {
  try {
    const data =[['test', null, 'test3', 'test4']]; // Assuming data is an array of arrays representing rows

    // Define the range where data will be inserted
    const range = `A1`; // Replace A1 with your starting cell if necessary

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: data,
      },
    });

    res.status(200).send('Data added to Google Sheets');
  } catch (error) {
    console.error('Error adding data to Google Sheets:', error);
    res.status(500).send('Error adding data');
  }
});
// --GOOGLE API

app.use(authRoute);
app.use(customerRoute);
app.use(orderRoute);
app.use(errorMiddleware);

module.exports = app;
