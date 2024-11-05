const { Router } = require("express");
const passport = require("passport");

const CustomerController = require("../controllers/customer.controller");

const router = Router();

router.get(
  "/api/customer",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => CustomerController.get(req, res, next)
);
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

router.post("/verify/:id", async (req, res, next) => {
  CustomerController.verify(req, res, next);
});

module.exports = router;
