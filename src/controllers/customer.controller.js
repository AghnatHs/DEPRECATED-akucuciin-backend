const { TokenExpiredError } = require("jsonwebtoken");
const AuthenticationService = require("../services/authentication.service");
const CustomerService = require("../services/customer.service");
const { CustomerQuery } = require("../database/query");
const {
  AuthenticationError,
  TokenInvalidError,
} = require("../errors/customError");
const APPCONFIG = require("../configs/app.config");

const CustomerController = {
  get: async (req, res, next) => {
    const result = await CustomerService.get(req.user);
    return res.status(200).json({ success: true, data: result });
  },
  register: async (req, res, next) => {
    try {
      const result = await CustomerService.register(req.body);
      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (e) {
      next(e);
    }
  },
  verify: async (req, res, next) => {
    try {
      const result = await CustomerService.verify(req);
      res.redirect(APPCONFIG.url.verifyEmailSuccess);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        try {
          const { email } = req.params;
          const { isActive } =
            CustomerQuery.getActiveOfCustomerByEmail.get(email);
          if (isActive)
            return res.redirect(APPCONFIG.url.verifyEmailAlreadyActive);

          CustomerQuery.deleteCustomerByEmail.run(email);
        } catch (err) {}
      } else if (e instanceof TokenInvalidError) {
        return res.redirect(APPCONFIG.url.verifyEmailInvalid);
      } else if (e instanceof AuthenticationError) {
        return res.redirect(APPCONFIG.url.verifyEmailAlreadyActive);
      }
      return res.redirect(APPCONFIG.url.verifyEmailExpired);
    }
  },
  requestResetPassword: async (req, res, next) => {
    try {
      const result = await CustomerService.requestResetPassword(req);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e) {
      next(e);
    }
  },
  putResetPassword: async (req, res, next) => {
    try {
      const result = await CustomerService.changePassword(req);
      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (e) {
      next(e);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await AuthenticationService.login(req.body);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e) {
      next(e);
    }
  },
  logout: async (req, res, next) => {
    try {
      const result = await AuthenticationService.logout(req.body);
      return res.status(200).json({
        success: true,
        message: result,
      });
    } catch (e) {
      next(e);
    }
  },
  put: async (req, res, next) => {
    try {
      const result = await CustomerService.put(req);
      return res.status(200).json({
        success: true,
        message: result,
      });
    } catch (e) {
      next(e);
    }
  },
};

module.exports = CustomerController;
