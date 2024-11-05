const jwt = require("jsonwebtoken");
const { v7: uuidV7} = require('uuid');

var jwtMaxAgeInSeconds = Number(process.env.JWT_MAX_AGE);
var jwtAccessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
var jwtRefreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
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
        unique: uuidV7()
      },
      jwtRefreshTokenSecret
    ),
  verifyToken: (token, secret) => jwt.verify(token, secret),
};

module.exports = TokenManager;
