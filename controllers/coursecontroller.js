import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Course } from "../models/Course.js";

import ErrorHandler from "../utils/errorHandler.js";

import { Stats } from "../models/Stats.js";

// get all courses
export const getAllCourses = catchAsyncErrors(async (req, res, next) => {
  const courses = await Course.find();
  // .sort({ createdAt: "desc" });
  res.status(200).json({
    success: true,
    courses,
  });
});

// get lecture of the course
export const getCourseLectures = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }
  course.views += 1;
  await course.save();
  res.status(200).json({
    success: true,
    lectures: course.lectures,
  });
});
// get single course
export const getSingleCourse = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }
  course.views += 1;
  await course.save();
  res.status(200).json({
    success: true,
    course: course,
  });
});

// demo free lecture
export const getDemoLecture = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  await course.save();
  res.status(200).json({
    success: true,
    singleCourse: course,
  });
});

// add lectures to section
// export const addSectionlectureVimeo = catchAsyncErrors(
//   async (req, res, next) => {
//     const { id, sid } = req.params;

//     const course = await Course.findById(id);
//     if (!course) {
//       return next(new ErrorHandler("Course not found", 404));
//     }
//     var index = false;
//     for (let i = 0; i < course.sections.length; i++) {
//       if (String(course.sections[i]._id) === String(sid)) {
//         index = i;
//       }
//     }

//     if (!index && index !== 0) {
//       return next(new ErrorHandler("Section not found", 404));
//     }
//     // upload file here

//     let client = new Vimeo(
//       process.env.client_id,
//       process.env.client_secret,
//       process.env.access_token
//     );
//     async function uploadVideo(filePath) {
//       try {
//         // Step 1: Upload the video file
//         const uploadResponse = await axios({
//           method: "post",
//           url: "https://api.vimeo.com/me/videos",
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//             Accept: "application/vnd.vimeo.*+json;version=3.4",
//           },
//           data: {
//             upload: {
//               approach: "tus",
//               size: fs.statSync(filePath).size,
//             },
//           },
//         });

//         console.log("Video uploaded successfully!");
//       } catch (error) {
//         console.log("Error uploading video:");
//       }
//     }
//     const file = req.file;
//     const fileUri = getDataUri(file);
//     const videoFilePath = file;
//     uploadVideo(videoFilePath);

//     res.status(200).json({
//       success: true,
//       message: "Lecture added in Course Section",
//       // uri: videoUri,
//     });
//   }
// );
// get sections lecture of the course
export const getSectionLectures = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }
  var index = false;
  for (let i = 0; i < course.sections.length; i++) {
    if (String(course.sections[i]._id) === String(req.params.sid)) {
      index = i;
    }
  }

  if (!index && index !== 0) {
    return next(new ErrorHandler("Section not found", 404));
  }
  course.views += 1;
  await course.save();
  res.status(200).json({
    success: true,
    lectures: course.sections[index].lectures,
  });
});

// watcher
Course.watch().on("change", async () => {
  const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);
  const courses = await Course.find({});
  let totalViews = 0;
  for (let i = 0; i < courses.length; i++) {
    totalViews += courses[i].views;
  }
  stats[0].views = totalViews;
  stats[0].createdAt = new Date(Date.now());
  await stats[0].save();
});
