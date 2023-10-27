import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Stats } from "../models/Stats.js";
import { User } from "../models/User.js";

// conatct form
export const contact = catchAsyncErrors(async (req, res, next) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return next(new ErrorHandler("Please add all fields", 400));
  }
  const to = process.env.MY_MAIL;
  const subject = "Contact from haco";
  const text = `I am ${name} and my email is ${email}.\n ${message}.`;
  await sendEmail(to, subject, text);
  res.status(200).json({
    success: true,
    message: "Your Message has been Sent.",
  });
});
export const submitUserDetails = catchAsyncErrors(async (req, res, next) => {
  const {
    who,
    level,
    grade,
    subject: userSubject,
    text: userText,
    phoneNumber,
    country,
  } = req.body;

  const to = process.env.MY_MAIL;
  const subject = "Contact from haco";

  const text = `${who}\n${level}\n${grade}\n${userSubject}\n${country}\n${phoneNumber}\n${userText}`;
  await sendEmail(to, subject, text);
  res.status(200).json({
    success: true,
    message: "Your Message has been Sent.",
  });
});

//
export const sendOtp = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const generateOTP = (length = 4) => {
    let otp = "";

    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    return otp;
  };
  let check = generateOTP(6);

  await sendEmail(user.email, "haco Email verification", `OTP is  ${check}`);
  user.otp = check;
  await user.save();

  res.status(200).json({
    success: true,
    message: `OTP is sent to ${user.email} successfully`,
  });
});
export const verifyOtp = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { otp } = req.body;
  if (!otp) {
    return next(new ErrorHandler("Please Enter otp", 404));
  }

  if (otp != user.otp) {
    return next(new ErrorHandler("Code is invalid or has been expired", 401));
  }

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
    referral.referrals[index].status = "Verified";

    await referral.save();
  }

  user.verify = true;
  // await user.otp.deleteOne();
  user.otp = null;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Email Verified",
  });
});
