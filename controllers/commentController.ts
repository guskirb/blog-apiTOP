import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

import Comment from "../models/comment";

const commentController = (() => {
  const get_comments = asyncHandler(async (req: Request, res: Response) => {
    try {
      const comments = await Comment.find({ post: req.params.id })
        .sort({ _id: -1 })
        .populate("author")
        .exec();

      res.status(200).json({
        success: true,
        comments: comments,
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

  const create_comment = [
    // Validate and sanitise request body
    body("comment", "Enter a comment").trim().notEmpty().escape(),

    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
        const newComment = new Comment({
          author: req.user?._id,
          post: req.params.id,
          comment: req.body.comment,
        });

        // Save new comment to DB
        const comment = await newComment.save();

        res.status(201).json({
          success: true,
          comment: comment,
        });
        return;
      } catch (err) {
        next(err);
      }
    }),
  ];

  const delete_comment = asyncHandler(async (req: Request, res: Response) => {
    try {
      const comment = await Comment.findById(req.params.commentId).populate(
        "author"
      );

      // Check if user is author or admin
      if (comment?.author.id === req.user?.id || req.user?.admin) {
        // Delete comment by request params
        await Comment.findByIdAndDelete(req.params.commentId);

        res.status(200).json({
          success: true,
          msg: "Deleted successfully",
        });
        return;
      } else {
        res.status(401).json({
          success: false,
          errors: "Not authorized to access this route.",
        });
        return;
      }
    } catch (err) {
      res.status(400).json({
        success: false,
        errors: err,
      });
      return;
    }
  });

  return {
    get_comments,
    create_comment,
    delete_comment,
  };
})();

export default commentController;
