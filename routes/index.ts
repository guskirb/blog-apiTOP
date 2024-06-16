import express from "express";
const router = express.Router();
import authController from "../controllers/authController";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json("hi");
});

router.post("/login", authController.login);

export default router;
