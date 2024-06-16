import express from "express";
const router = express.Router();
import userController from "../controllers/userController";

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* POST new user. */
router.post("/", userController.user_post);

export default router;
