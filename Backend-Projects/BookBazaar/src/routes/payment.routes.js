import { Router } from "express";
import {
    createPayment,
    verifyPayment,
} from "../controllers/payment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router();

router.route("/create").post(verifyJWT, createPayment)
router.route("/verify").post(verifyJWT, verifyPayment)

export default router;