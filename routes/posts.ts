import express from "express";
import postController from "../controllers/postController";

const router = express.Router();

/* GET posts listing. */
router.get("/", postController.get_posts);

/* POST new post. */
router.post("/", postController.create_post);

router.post("/:id/update", postController.update_post);

router.post("/:id/delete", postController.delete_post);

export default router;
