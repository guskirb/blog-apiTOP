import express from "express";
const router = express.Router();
import postController from "../controllers/postController";

router.get("/", postController.post_get);

router.post("/", postController.post_post);

export default router;
