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
    body("date").isISO8601().toDate(),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
    }),
  ];

  return {
    post_get,
    post_post,
  };
})();

export default postController;
