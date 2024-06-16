import express from "express";
const router = express.Router();
import postController from "../controllers/postController";

/* GET posts listing. */
router.get("/", postController.post_get);

/* POST new post. */
router.post("/", postController.post_post);

export default router;
