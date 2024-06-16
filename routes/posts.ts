import express from "express";
import postController from "../controllers/postController";

const router = express.Router();

// GET all posts
router.get("/", postController.get_posts);

// POST new post
router.post("/", postController.create_post);

// GET post
router.get("/:id", postController.get_post);

// UPDATE post
router.post("/:id/update", postController.update_post);

// DELETE post
router.post("/:id/delete", postController.delete_post);

export default router;
