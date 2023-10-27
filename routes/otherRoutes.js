import express from "express";
import {
  submitUserDetails,
  contact,
  sendOtp,
  verifyOtp,
} from "../controllers/otherController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

// contact form
router.route("/contact").post(contact);
router.route("/submituserdetails").post(submitUserDetails);

// otp form
router.route("/sendotp").post(isAuthenticatedUser, sendOtp);
router.route("/verifyotp").post(isAuthenticatedUser, verifyOtp);

export default router;
