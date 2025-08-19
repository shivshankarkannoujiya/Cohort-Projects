import { Router } from "express";
import { generateNewApiKey } from "../controllers/api.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, generateNewApiKey);

export default router;
