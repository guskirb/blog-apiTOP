import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import Comment from "../models/comment";

const commentController = (() => {
  const get_comments = asyncHandler(async (req, res, next) => {
    try {
      const comments = await Comment.find({ post: req.params.id }).exec();

      return res.status(200).json({
        success: true,
        comments: comments,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        errors: err,
      });
    }
  });

  const create_comment = [
    // Validate and sanitise request body
    body("comment", "Enter a comment").trim().notEmpty().escape(),

    asyncHandler(async (req, res, next) => {
      // Check for errors
      const errors = validationResult(req);

      // Return invalid if errors
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      try {
        const newComment = new Comment({
          author: req.user._id,
          post: req.params.id,
          comment: req.body.comment,
        });

        // Save new post to DB
        const comment = await newComment.save();

        return res.status(201).json({
          success: true,
          comment: comment,
        });
      } catch (err) {
        next(err);
      }
    }),
  ];

  return {
    get_comments,
    create_comment
  };
})();

export default commentController;
