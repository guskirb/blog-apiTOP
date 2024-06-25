import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

import Post from "../models/post";
import Comment from "../models/comment";

const postController = (() => {
  const get_posts = asyncHandler(async (req: Request, res: Response) => {
    // Get all posts from DB
    const posts = await Post.find({ public: true })
      .sort({ _id: -1 })
      .populate("author")
      .exec();

    res.status(200).json({
      success: true,
      posts: posts,
    });
    return;
  });

  const get_private = asyncHandler(async (req: Request, res: Response) => {
    // Get all posts from DB
    const posts = await Post.find({ public: false })
      .sort({ _id: -1 })
      .populate("author")
      .exec();

    res.status(200).json({
      success: true,
      posts: posts,
    });
    return;
  });

  const get_recent = asyncHandler(async (req: Request, res: Response) => {
    // Get recent posts from DB
    const posts = await Post.find({ public: true })
      .sort({ _id: -1 })
      .populate("author")
      .limit(4)
      .exec();

    res.status(200).json({
      success: true,
      posts: posts,
    });
    return;
  });

  const get_post = asyncHandler(async (req: Request, res: Response) => {
    try {
      // Get post from DB by request params
      const post = await Post.findById(req.params.id).populate("author").exec();

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
    body("title", "A title is required").trim().notEmpty().escape(),
    body("image_url", "An image is required").trim().notEmpty().escape(),
    body("post", "A post is required").trim().notEmpty().escape(),
    body("public").isBoolean(),
    body("category", "A category is required").trim().notEmpty().escape(),

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
          image_url: req.body.image_url,
          post: req.body.post,
          public: req.body.public,
          author: req.user?._id,
          category: req.body.category,
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
    body("title", "A Title is required").trim().notEmpty().escape(),
    body("image_url", "An image is required").trim().notEmpty().escape(),
    body("post", "A post is required").trim().notEmpty().escape(),
    body("public").isBoolean(),
    body("category", "A category is required").trim().notEmpty().escape(),

    asyncHandler(async (req: Request, res: Response) => {
      try {
        // Check for errors
        const errors = validationResult(req);

        const updatedPost = new Post({
          title: req.body.title,
          image_url: req.body.image_url,
          post: req.body.post,
          public: req.body.public,
          category: req.body.category,
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
    } catch (err) {
      res.status(400).json({
        success: false,
        errors: err,
      });
      return;
    }
  });

  const get_category = asyncHandler(async (req: Request, res: Response) => {
    try {
      // Get post from DB by request params
      const posts = await Post.find({
        category: { $regex: new RegExp(req.params.category, "i") },
      })
        .populate("author")
        .exec();
      
      res.status(200).json({
        success: true,
        posts: posts,
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
    get_posts,
    get_private,
    get_recent,
    get_post,
    create_post,
    update_post,
    delete_post,
    get_category,
  };
})();

export default postController;
