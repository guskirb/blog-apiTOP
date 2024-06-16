import express from "express";
import postController from "../controllers/postController";

const router = express.Router();

/* GET posts listing. */
router.get("/", postController.post_get);

/* POST new post. */
router.post("/", postController.post_post);

export default router;
