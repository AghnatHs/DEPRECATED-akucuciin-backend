const jwt = require("jsonwebtoken");
const { v7: uuidV7 } = require("uuid");

var jwtMaxAgeInSeconds = Number(process.env.JWT_MAX_AGE);
var jwtRegisterMaxAgeInSeconds = Number(process.env.VERIFY_MAX_AGE);
var jwtRequestResetPasswordMaxAgeInSeconds = Number(process.env.RESET_PASSWORD_MAX_AGE);

var jwtAccessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
var jwtRefreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
var jwtRegisterSecret = process.env.JWT_REGISTER_SECRET;
var jwtRequestResetPasswordSecret = process.env.JWT_RESET_PASSWORD_SECRET;
const TokenManager = {
  generateAccessToken: (credentials) =>
    jwt.sign(
      {
        ...credentials,
        unique: uuidV7(),
        exp: Math.floor(Date.now() / 1000) + jwtMaxAgeInSeconds,
      },
      jwtAccessTokenSecret
    ),
  generateRefreshToken: (credentials) =>
    jwt.sign(
      {
        ...credentials,
        unique: uuidV7(),
      },
      jwtRefreshTokenSecret
    ),
  generateRegisterToken: (id) =>
    jwt.sign(
      {
        id: id,
        unique: uuidV7(),
        exp: Math.floor(Date.now() / 1000) + jwtRegisterMaxAgeInSeconds,
      },
      jwtRegisterSecret
    ),
    generateRequestResetPasswordToken: (email) =>
      jwt.sign(
        {
          email: email,
          unique: uuidV7(),
          exp: Math.floor(Date.now() / 1000) + jwtRequestResetPasswordMaxAgeInSeconds,
        },
        jwtRequestResetPasswordSecret
      ),
  verifyToken: (token, secret) => jwt.verify(token, secret),
};

module.exports = TokenManager;
