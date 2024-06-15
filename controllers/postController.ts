import Post from "../models/post";
import asyncHandler from "express-async-handler";

const postController = (() => {
  const post_get = asyncHandler(async (req, res, next) => {
    const posts = await Post.find().exec();
    console.log(req);
    res.status(200).json(posts);
  });

  return {
    post_get,
  };
})();

export default postController;
