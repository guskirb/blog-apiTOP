import "dotenv/config";
import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";

import User from "../models/user";

const userFromJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      return next();
    }
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN);

      const user = await User.findById(decoded.sub);

      if (!user) {
        return next();
      } else {
        req.user = user;
        return next();
      }
    } catch (err) {
      return next(err);
    }
  }
);

export default userFromJWT;
