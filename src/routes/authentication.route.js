const { Router } = require("express");
const passport = require("passport");
const AuthenticationController = require("../controllers/authentication.controller");

const router = Router();

router.put(
  "/api/auth",
  async (req, res, next) => AuthenticationController.refresh(req, res, next)
);

module.exports = router;
