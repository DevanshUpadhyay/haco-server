import express from "express";
import { buySubscription } from "../controllers/paymentController.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/subscribe").post(isAuthenticatedUser, buySubscription);

export default router;
