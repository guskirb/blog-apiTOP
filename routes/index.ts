import express from "express";
import isAdmin from "../utils/isAdmin";

const router = express.Router();

/* GET home page. */
router.get("/", isAdmin, function (req, res, next) {
  res.json({
    msg: 'Welcome to the blog api!'
  });
});

export default router;
