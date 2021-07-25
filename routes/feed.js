const express = require("express");

const feedController = require("../controllers/feed");
const {
  postValidation,
  validateFile,
  updatePostValidation,
} = require("../middleware/validation");
const is_auth = require("../middleware/is-auth");
const avatar = require("../middleware/imageHander");
const router = express.Router();

// GET /feed/posts
router.get("/posts", is_auth, feedController.getPosts);

// POST /feed/post
router.post(
  "/post",
  is_auth,
  avatar,
  postValidation,
  validateFile,
  feedController.createPost
);
router.get("/post/:id", is_auth, feedController.getPost);
router.put(
  "/post/:id",
  is_auth,
  avatar,
  postValidation,
  feedController.updatePost
);
router.delete("/post/:id", is_auth, feedController.deletePost);

module.exports = router;
