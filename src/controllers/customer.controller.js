const { TokenExpiredError } = require("jsonwebtoken");
const AuthenticationService = require("../services/authentication.service");
const CustomerService = require("../services/customer.service");
const { CustomerQuery } = require("../database/query");
const { AuthenticationError, TokenInvalidError } = require("../errors/customError");

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
      res.redirect(process.env.VERIFY_URI_REDIRECT_SUCCESS);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        try {
          const { email } = req.params;
          const { isActive } = CustomerQuery.getActiveOfCustomerByEmail.get(email);
          if (isActive) return res.redirect(process.env.VERIFY_URI_REDIRECT_ERROR_ALREADY_ACT);

          CustomerQuery.deleteCustomerByEmail.run(email);
        } catch (err) {}
      } else if (e instanceof TokenInvalidError) {
        return res.redirect(process.env.VERIFY_URI_REDIRECT_ERROR_INVALID);
      } else if (e instanceof AuthenticationError) {
        return res.redirect(process.env.VERIFY_URI_REDIRECT_ERROR_ALREADY_ACT);
      }
      return res.redirect(process.env.VERIFY_URI_REDIRECT_ERROR_EXPIRED);
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
