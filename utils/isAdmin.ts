import { Request, Response, NextFunction } from "express";

function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.admin) {
      return next();
    } else {
      res.status(401).json({
        success: false,
        errors: "Not authorized to access this route.",
      });
      return;
    }
  } catch (err) {
    res.status(401).json({
      success: false,
      errors: "Not authorized to access this route.",
    });
    return;
  }
}

export default isAdmin;
