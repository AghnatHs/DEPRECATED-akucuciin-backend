const { Router } = require("express");
const passport = require("passport");
const OrderController = require("../controllers/order.controller");

const router = Router();

router.post(
  "/api/order",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => OrderController.post(req, res, next)
);

router.get(
  "/api/orders",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => OrderController.get(req, res, next)
);

module.exports = router;
