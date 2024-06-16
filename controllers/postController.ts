import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import Post from "../models/post";

const postController = (() => {
  const post_get = asyncHandler(async (req, res, next) => {
    const posts = await Post.find().exec();

    res.status(200).json(posts);
  });

  const post_post = [
    body("title", "Title is required").trim().notEmpty().escape(),
    body("post", "A post is required").trim().notEmpty().escape(),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

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

        await newPost.save();

        return res.status(201).json({
          success: true,
          post: newPost,
        });
      } catch (err) {
        next(err);
      }
    }),
  ];

  return {
    post_get,
    post_post,
  };
})();

export default postController;
