const { validationResult } = require("express-validator");
const Post = require("../models/post");
const path = require("path");
const fs = require("fs");
const io = require("../socket");
exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Fetched posts successfully.",
      posts: posts,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;

  try {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("validation faild");
      error.statusCode = 422;
      throw error;
    }
    const post = new Post({
      title,
      content,
      imageUrl,
      creator: req.user._id,
    });

    await post.save();
    io.getIO().emit("posts", {
      action: "create",
      post: {
        ...post._doc,
        creator: { _id: req.user._id, name: req.user.name },
      },
    });
    res.status(201).json({
      message: "Post created successfully!",
      post,
    });
  } catch (e) {
    next(e);
  }
};

exports.getPost = async (req, res, next) => {
  const postID = req.params.id;
  try {
    const post = await Post.findById(postID);
    if (!post) {
      const error = new Error("Post not Found !");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({
      message: "fetched posts sucssfuly",
      post,
    });
  } catch (e) {
    next(e);
  }
};
exports.updatePost = async (req, res, next) => {
  const postID = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  const user = req.user;

  try {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("validation faild");
      error.statusCode = 422;
      throw error;
    }

    const post = await Post.findById(postID).populate("creator");
    if (!post) {
      const error = new Error("Could not Found Post!");
      error.statusCode = 404;
      throw error;
    }
    console.log(post.creator._id.toString(), user._id.toString());
    if (post.creator._id.toString() != user._id.toString()) {
      const error = new Error("Not Authorized");
      error.statusCode = 403;
      throw error;
    }
    post.title = title;
    post.content = content;
    if (req.file) {
      clearOld(post.imageUrl);
      let imageUrl =
        "images/" +
        req.file.path.replace(/\\/g, "/").substring("public".length);
      post.imageUrl = imageUrl;
    }
    await post.save();
    io.getIO().emit("posts", {
      action: "update",
      post,
    });
    res.status(200).json({ msg: "post updated !", post });
  } catch (e) {
    next(e);
  }
};
exports.deletePost = async (req, res, next) => {
  const postId = req.params.id;
  const user = req.user;
  try {
    const post = await Post.findById(postId);
    if (post.creator.toString() != user._id.toString()) {
      const error = new Error("Not Authorized");
      error.statusCode = 403;
      throw error;
    }

    clearOld(post.imageUrl);
    await Post.findByIdAndRemove(postId);
    io.getIO().emit("posts", {
      action: "delete",
      post: postId,
    });
    res.status(200).json({ msg: "post deleted !" });
  } catch (e) {
    next(e);
  }
};
const clearOld = (oldFile) => {
  oldFile = path.join(__dirname, "..", oldFile);

  fs.unlink(oldFile, (err) => {
    if (err) {
      throw new Error(err);
    }
  });
};
