import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";

import User from "../models/user";
import issueJWT from "../utils/issueJWT";

const authController = (() => {
  const register = [
    // Validate and sanitise request body
    body("username", "A username is required")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        const user = await User.findOne({ username: value }).exec();
        if (user) {
          throw new Error("Username already in use");
        }
      })
      .escape(),
    body("email", "An email is required")
      .trim()
      .isEmail()
      .custom(async (value) => {
        const user = await User.findOne({ email: value }).exec();
        if (user) {
          throw new Error("Email already in use");
        }
      })
      .escape(),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must contain at least 5 characters")
      .escape(),

    asyncHandler(async (req: Request, res: Response) => {
      // Check for errors
      const errors = validationResult(req);

      // Return invalid if errors
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array(),
        });
        return;
      }

      try {
        // Encrypt password and create a new user object
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPass,
          admin: false,
        });
        // Save user to DB & issue JWT
        const user = await newUser.save();
        const jwt = issueJWT(newUser);

        res.status(201).json({
          success: true,
          user: user,
          token: jwt.token,
          expires: jwt.expires,
        });
        return;
      } catch (err) {
        res.status(400).json({
          success: false,
          errors: err,
        });
        return;
      }
    }),
  ];

  const login = [
    // Validate and sanitise request body
    body("username")
      .trim()
      .custom(async (value) => {
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

    asyncHandler(async (req: Request, res: Response) => {
      // Check for errors
      const errors = validationResult(req);

      // Return invalid if errors
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array(),
        });
        return;
      } else {
        // Find user in DB & issue JWT
        try {
          const user = await User.findOne({
            $or: [
              { email: req.body.username },
              { username: req.body.username },
            ],
          }).exec();
          const jwt = issueJWT(user);

          res.status(200).json({
            success: true,
            user: user,
            token: jwt.token,
            expires: jwt.expires,
          });
          return;
        } catch (err) {
          res.status(400).json({
            success: false,
            errors: err,
          });
          return;
        }
      }
    }),
  ];

  return {
    register,
    login,
  };
})();

export default authController;
