import asyncHandler from "express-async-handler";
import passport from "passport";

import User from "../models/user";

const authController = (() => {
  const login = [
    passport.authenticate("local", {
      session: false,
      failureRedirect: "/login-failed",
    }),
    asyncHandler(async (req, res, next) => {

    }),
  ];

  return {
    login,
  };
})();

export default authController;
