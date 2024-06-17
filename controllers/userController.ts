import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

import User from "../models/user";

const userController = (() => {
  const get_users = asyncHandler(async (req: Request, res: Response) => {
    // Get all users from DB
    const users = await User.find().exec();

    res.status(200).json({
      success: true,
      users: users,
    });
    return;
  });

  const get_user = asyncHandler(async (req: Request, res: Response) => {
    try {
      // Get user from DB by request params
      const user = await User.findById(req.params.id).exec();

      res.status(200).json({
        success: true,
        user: user,
      });
      return;
    } catch (err) {
      res.status(400).json({
        success: false,
        errors: err,
      });
      return;
    }
  });

  return {
    get_users,
    get_user,
  };
})();

export default userController;
