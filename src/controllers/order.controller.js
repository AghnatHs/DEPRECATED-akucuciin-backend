const OrderService = require("../services/order.service");

const OrderController = {
  get: async (req, res, next) => {
    try {
      const result = await OrderService.get(req);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e) {
      next(e);
    }
  },
  post: async (req, res, next) => {
    try {
      const result = await OrderService.post(req);
      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  },
};

module.exports = OrderController;
