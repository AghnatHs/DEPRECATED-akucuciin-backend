const AuthenticationService = require("../services/authentication.service");
const CustomerService = require("../services/customer.service");

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
    } catch (e) {}
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
      console.log(e);
      next(e);
    }
  },
};

module.exports = CustomerController;
