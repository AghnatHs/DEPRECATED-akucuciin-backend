const bcrypt = require("bcrypt");

const { CustomerQuery, AuthenticationQuery } = require("../database/query");
const { AuthenticationError } = require("../errors/customError");
const TokenManager = require("../tokenizer/tokenManager");
const {
  postAuthenticationSchema,
  putAuthenticationSchema,
  deleteAuthenticationSchema,
} = require("../validators/authentication.validator");
const validate = require("../validators/validator");

const AuthenticationService = {
  login: async (req) => {
    const credentials = validate(postAuthenticationSchema, req);

    const customer = CustomerQuery.getCustomerForAuth.get(credentials.email);
    if (!customer)
      throw new AuthenticationError("Login gagal, kredensial salah");

    const isPasswordMatch = await bcrypt.compare(
      credentials.password,
      customer.password
    );
    if (!isPasswordMatch)
      throw new AuthenticationError("Login gagal, kredensial salah");

    const { id, email } = customer;
    let accessToken = TokenManager.generateAccessToken({ id, email });
    let refreshToken = TokenManager.generateRefreshToken({ id, email });

    AuthenticationQuery.postRefreshToken.run({ id, refreshToken });

    return { accessToken, refreshToken };
  },
  logout: async (req) => {
    const { refresh_token: refreshToken } = validate(
      deleteAuthenticationSchema,
      req
    );
    const isRefreshTokenExists =
      AuthenticationQuery.isRefreshTokenExists.get(refreshToken).count;
    if (!isRefreshTokenExists)
      throw new AuthenticationError("Invalid refresh token");

    AuthenticationQuery.deleteRefreshToken.run({ refreshToken });
    return "Successfully Log Out";
  },
  refresh: async (req) => {
    const { refresh_token: refreshToken } = validate(
      putAuthenticationSchema,
      req
    );

    const isRefreshTokenExists =
      AuthenticationQuery.isRefreshTokenExists.get(refreshToken).count;
    if (!isRefreshTokenExists)
      throw new AuthenticationError("Invalid refresh token");

    const customer = TokenManager.verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    let accessToken = TokenManager.generateAccessToken(customer);
    let newRefreshToken = TokenManager.generateRefreshToken(customer);
    AuthenticationQuery.putRefreshToken.run({
      newRefreshToken,
      refreshToken,
    });
    return { accessToken, refreshToken: newRefreshToken };
  },
};

module.exports = AuthenticationService;
