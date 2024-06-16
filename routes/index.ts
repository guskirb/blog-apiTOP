import express from "express";

const router = express.Router();

/* GET home page. */
router.get("/", userFromJWT, function (req, res, next) {
  res.json({
    msg: 'hi'
  });
});

export default router;
