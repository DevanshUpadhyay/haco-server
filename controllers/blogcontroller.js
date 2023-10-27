import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Blog } from "../models/Blog.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";

// get all blogs
export const getAllBlogs = catchAsyncErrors(async (req, res, next) => {
  const keyword = req.query.keyword || "";
  const category = req.query.category || "";
  const page = Number(req.query.page) || 1;
  let limit = 5;
  let skip = (page - 1) * limit;

  const allblogs = await Blog.find({
    title: {
      $regex: keyword,
      $options: "i",
    },
    category: {
      $regex: category,
      $options: "i",
    },
  })
    .sort({ createdAt: "desc" })
    .skip(skip)
    .limit(limit);
  const popularBlogs = await Blog.find().sort({ views: "desc" }).limit(6);
  const recentBlogs = await Blog.find().sort({ createdAt: "desc" }).limit(6);
  res.status(200).json({
    success: true,
    blogs: {
      allblogs,
      popularBlogs,
      recentBlogs,
    },
  });
});

// get single blog
export const getSingleBlog = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }
  blog.views += 1;
  await blog.save();
  res.status(200).json({
    success: true,
    blog,
  });
});
