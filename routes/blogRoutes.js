import express from "express";

import { getAllBlogs, getSingleBlog } from "../controllers/blogcontroller.js";
const router = express.Router();

router.route("/allblogs").get(getAllBlogs);

router
  .route("/blog/:id")

  .get(getSingleBlog);

export default router;
