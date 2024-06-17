import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import Post from "../models/post";

const postController = (() => {
  const get_posts = asyncHandler(async (req, res, next) => {
    // Get all posts from DB
    const posts = await Post.find().exec();

    return res.status(200).json({
      success: true,
      posts: posts,
    })
  });

  const get_post = asyncHandler(async (req, res, next) => {
    try {
      // Get post from DB by request params 
      const post = await Post.findById(req.params.id).exec();

      return res.status(200).json({
        success: true,
        post: post,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        errors: err,
      });
    }
  });

  const create_post = [
    // Validate and sanitise request body
    body("title", "Title is required").trim().notEmpty().escape(),
    body("post", "A post is required").trim().notEmpty().escape(),

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
        const newPost = new Post({
          title: req.body.title,
          post: req.body.post,
          author: req.user._id,
        });

        // Save new post to DB
        const post = await newPost.save();

        return res.status(201).json({
          success: true,
          post: post,
        });
      } catch (err) {
        next(err);
      }
    }),
  ];

  const update_post = [
    // Validate and sanitise request body
    body("title", "Title is required").trim().notEmpty().escape(),
    body("post", "A post is required").trim().notEmpty().escape(),

    asyncHandler(async (req, res, next) => {
      // Check for errors
      const errors = validationResult(req);

      const updatedPost = new Post({
        title: req.body.title,
        post: req.body.post,
        _id: req.params.id,
      });

      // Return invalid if errors
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      } else {
        // Save updated post to DB
        const post = await Post.findByIdAndUpdate(
          req.params.id,
          updatedPost,
          {}
        );
        return res.status(200).json({
          success: true,
          post: post,
        });
      }
    }),
  ];

  const delete_post = asyncHandler(async (req, res, next) => {
    try {
      // Delete post by request params
      await Post.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        success: true,
        msg: "Deleted successfully",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        errors: err,
      });
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
