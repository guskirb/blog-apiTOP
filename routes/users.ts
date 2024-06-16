import express from "express";
const router = express.Router();
import authController from "../controllers/authController";
import passport = require("passport");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/login-failed", function (req, res, next) {
  res.status(401).json({
    error: "Login failed",
  });
});

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    return res.status(200).json({
      success: true
    });
  }
);

export default router;
