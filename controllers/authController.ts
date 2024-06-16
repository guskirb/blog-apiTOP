import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

import User from "../models/user";

const authController = (() => {
  const login = [

    // Validate and sanitise request body
    body("username")
      .trim()
      .custom(async (value) => {
        // Check if username is present in DB
        const user = await User.findOne({
          $or: [{ email: value }, { username: value }],
        }).exec();
        if (!user) {
          return new Error("User not found");
        }
      })
      .escape(),
    body("password", "Password incorrect")
      .isLength({ min: 5 })
      .withMessage("Password must contain at least 5 characters")
      .custom(async (value, { req }) => {
        // Check if password matches username
        const user = await User.findOne({
          $or: [{ email: req.body.username }, { username: req.body.username }],
        }).exec();
        if (!user) {
          throw new Error();
        } else {
          const match = await bcrypt.compare(value, user.password);
          if (!match) {
            throw new Error("Password incorrect");
          }
        }
      })
      .escape(),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(401).json({
          message: "Login unsuccessful.",
          errors: errors.array(),
        });
      } else {
        next();
      }
    }),
  ];

  return {
    login,
  };
})();

export default authController;
