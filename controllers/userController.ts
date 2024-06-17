import asyncHandler from "express-async-handler";

import User from "../models/user";

const userController = (() => {
  const get_users = asyncHandler(async (req, res, next) => {
    // Get all users from DB
    const users = await User.find().exec();

    return res.status(200).json({
      success: true,
      users: users,
    });
  });

  const get_user = asyncHandler(async (req, res, next) => {
    try {
      // Get user from DB by request params
      const user = await User.findById(req.params.id).exec();

      return res.status(200).json({
        success: true,
        user: user,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        errors: err,
      });
    }
  });

  return {
    get_users,
    get_user
  };
})();

export default userController;
