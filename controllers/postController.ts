import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

import Post from "../models/post";
import Comment from "../models/comment";

const postController = (() => {
  const get_posts = asyncHandler(async (req: Request, res: Response) => {
    // Get all posts from DB
    const posts = await Post.find().exec();

    res.status(200).json({
      success: true,
      posts: posts,
    });
    return;
  });

  const get_post = asyncHandler(async (req: Request, res: Response) => {
    try {
      // Get post from DB by request params
      const post = await Post.findById(req.params.id).exec();

      res.status(200).json({
        success: true,
        post: post,
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

  const create_post = [
    // Validate and sanitise request body
    body("title", "Title is required").trim().notEmpty().escape(),
    body("post", "A post is required").trim().notEmpty().escape(),

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
        const newPost = new Post({
          title: req.body.title,
          post: req.body.post,
          author: req.user?._id,
        });

        // Save new post to DB
        const post = await newPost.save();

        res.status(201).json({
          success: true,
          post: post,
        });
        return;
      } catch (err) {
        next(err);
      }
    }),
  ];

  const update_post = [
    // Validate and sanitise request body
    body("title", "Title is required").trim().notEmpty().escape(),
    body("post", "A post is required").trim().notEmpty().escape(),

    asyncHandler(async (req: Request, res: Response) => {
      try {
        const post = await Post.findById(req.params.id)
          .populate("author")
          .exec();
        // Check if user is author or admin
        if (post?.author.id === req.user?.id || req.user?.admin) {
          // Check for errors
          const errors = validationResult(req);

          const updatedPost = new Post({
            title: req.body.title,
            post: req.body.post,
            _id: req.params.id,
          });

          // Return invalid if errors
          if (!errors.isEmpty()) {
            res.status(400).json({
              success: false,
              errors: errors.array(),
            });
            return;
          } else {
            // Save updated post to DB
            const post = await Post.findByIdAndUpdate(
              req.params.id,
              updatedPost,
              {}
            );

            res.status(200).json({
              success: true,
              post: post,
            });
            return;
          }
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
    }),
  ];

  const delete_post = asyncHandler(async (req: Request, res: Response) => {
    try {
      const post = await Post.findById(req.params.id).populate("author").exec();
      // Check if user is author or admin
      if (post?.author.id === req.user?.id || req.user?.admin) {
        // Delete post and its comments by request params
        await Promise.all([
          Post.findByIdAndDelete(req.params.id),
          Comment.deleteMany({ post: req.params.id }),
        ]);

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
    get_posts,
    get_post,
    create_post,
    update_post,
    delete_post,
  };
})();

export default postController;
