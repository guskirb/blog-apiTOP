import express from "express";
import postController from "../controllers/postController";
import commentsRouter from "./comments";
import isAdmin from "../utils/isAdmin";

const router = express.Router();

// GET all posts
router.get("/", postController.get_posts);

// POST new post
router.post("/", isAdmin, postController.create_post);

// GET post
router.get("/:id", postController.get_post);

// UPDATE post
router.post("/:id/update", isAdmin, postController.update_post);

// DELETE post
router.post("/:id/delete", isAdmin, postController.delete_post);

// Nested comment route
router.use("/:id/comments", commentsRouter);

export default router;
