import express from "express";
import postController from "../controllers/postController";
import commentsRouter from "./comments";
import isAdmin from "../utils/isAdmin";

const router = express.Router();

// GET all public posts
router.get("/", postController.get_posts);

// GET all private posts
router.get("/private", isAdmin, postController.get_private);

// GET recent posts
router.get("/recent", postController.get_recent);

// POST new post
router.post("/", isAdmin, postController.create_post);

// GET post by category
router.get("/category/:category", postController.get_category);

// GET post
router.get("/:id", postController.get_post);

// UPDATE post
router.post("/:id/update", isAdmin, postController.update_post);

// DELETE post
router.post("/:id/delete", isAdmin, postController.delete_post);

// Nested comment route
router.use("/:id/comments", commentsRouter);

export default router;
