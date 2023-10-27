import express from "express";
import {
  getAllCourses,
  getDemoLecture,
  getSectionLectures,
  getSingleCourse,
} from "../controllers/coursecontroller.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();
// get all courses
router.route("/courses").get(getAllCourses);
// create new courses

// get lecture of the course
router.route("/course/:id").get(getSingleCourse);

router.route("/coursedemo/:id").get(getDemoLecture);

router.route("/lecture/:id/:sid").get(isAuthenticatedUser, getSectionLectures);

export default router;
