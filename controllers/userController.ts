import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";

import User from "../models/user";

const userController = (() => {
  const user_post = [
    body("username", "A username is required").trim().notEmpty().escape(),
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

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Could not create user.",
          errors: errors.array(),
        });
      }

      try {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPass,
          admin: false,
        });
        await user.save();
        return res.status(201).json({
          message: "Successfully created user.",
        });
      } catch (err) {
        next(err);
      }
    }),
  ];

  return {
    user_post,
  };
})();

export default userController;
