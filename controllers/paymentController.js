import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/User.js";
import { Payment } from "../models/Payment.js";
import { instance } from "../server.js";
import crypto from "crypto";
import { Course } from "../models/Course.js";
import fetch from "node-fetch";

// buy subscription ..
export const buySubscription = catchAsyncErrors(async (req, res, next) => {
  const { courseId, payerId, createdAt, emailAddress, transactionId } =
    req.body;
  const user = await User.findById(req.user._id);
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ErrorHandler("Invalid Course Id", 404));
  }
  if (user.role === "admin") {
    return next(new ErrorHandler("Admin can't buy subscription", 400));
  }

  let duplicate = false;
  for (let i = 0; i < user.subscription.length; i++) {
    if (String(user.subscription[i].course_id) === String(courseId)) {
      duplicate = true;
      break;
    }
  }
  if (!duplicate) {
    user.subscription.push({
      transaction_id: transactionId,
      payer_id: payerId,
      course_id: courseId,
      email_address: emailAddress,
      transaction_at: createdAt,
    });
    if (user.referredBy) {
      const email = user.referredBy;
      var referral = await User.findOne({ email });
      var index = 0;
      for (let i = 0; i < referral.referrals.length; i++) {
        if (referral.referrals[i].userEmail === user.email) {
          index = i;
          break;
        }
      }
      referral.referrals[index].status = "Completed";
      referral.cashback = referral.cashback + 30;

      await referral.save();
    }
    user.plan = "active";
    if (user.cashback > course.price) {
      user.cashback = user.cashback - course.price;
    } else {
      user.cashback = 0;
    }
    await user.save();
    course.subscriptions += 1;
    await course.save();
  }

  res.status(201).json({
    success: true,
    message: "Subscribed Successfully",
  });
});
