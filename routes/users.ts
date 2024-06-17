import express from "express";
import { Request, Response, NextFunction } from "express";
import authController from "../controllers/authController";
import passport = require("passport");
import userController from "../controllers/userController";
import isAdmin from "../utils/isAdmin";

const router = express.Router();

// GET all users
router.get("/", isAdmin, userController.get_users);

// POST new user
router.post("/register", authController.register);

// POST user details & login
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

// Get user
router.get("/:id", userController.get_user);

export default router;
