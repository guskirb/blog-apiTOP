import express from "express";
import commentController from "../controllers/commentController";

const router = express.Router({ mergeParams: true });

// GET all comments
router.get("/", commentController.get_comments);

// POST new comment
router.post("/", commentController.create_comment);

// DELETE comment
router.post("/:commentId/delete", commentController.delete_comment);

export default router;
