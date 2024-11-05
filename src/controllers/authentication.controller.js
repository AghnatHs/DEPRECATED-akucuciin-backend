const AuthenticationService = require("../services/authentication.service");

const AuthenticationController = {
  refresh: async (req, res, next) => {
    try {
      const result = await AuthenticationService.refresh(req.body);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e) {
      next(e);
    }
  },
};

module.exports = AuthenticationController;
