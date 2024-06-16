import express from "express";
import { Request, Response, NextFunction } from "express";
import authController from "../controllers/authController";
import passport = require("passport");

const router = express.Router();

/* GET users listing. */
router.get("/", function (req: Request, res: Response) {
  res.send("respond with a resource");
});

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get(
  "/login-failed",
  function (req: Request, res: Response) {
    res.status(401).json({
      error: "Login failed",
    });
  }
);

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  function (req: Request, res: Response) {
    return res.status(200).json({
      success: true,
    });
  }
);

export default router;
