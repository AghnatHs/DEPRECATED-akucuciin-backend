const { Router } = require("express");
const passport = require("passport");

const CustomerController = require("../controllers/customer.controller");

const router = Router();

// get customer data
router.get(
  "/api/customer",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => CustomerController.get(req, res, next)
);
// update customer data
router.put(
  "/api/customer",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => CustomerController.put(req, res, next)
);

router.post("/api/customer", async (req, res, next) =>
  CustomerController.register(req, res, next)
);
router.post("/api/customer/login", async (req, res, next) =>
  CustomerController.login(req, res, next)
);
router.post("/api/customer/logout", async (req, res, next) =>
  CustomerController.logout(req, res, next)
);

// verify customer email
router.get(
  "/verify/customer/:email/:register_token",
  async (req, res, next) => {
    CustomerController.verify(req, res, next);
  }
);

// reset password customer
router.post("/request-reset-password", async (req, res, next) =>
  CustomerController.requestResetPassword(req, res, next)
);

router.put(
  "/request-reset-password/customer/:email/:reset_password_token",
  async (req, res, next) => CustomerController.putResetPassword(req, res, next)
);

module.exports = router;
