import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addReviewToBook,
    deleteReviewOfBook,
    listReviewOfBook,
} from "../controllers/review.controllers.js";

const router = Router();

router.route("/:bookId").post(verifyJWT, addReviewToBook);
router.route("/:bookId/review").get(listReviewOfBook);
router.route("/review/:reviewId").get(verifyJWT, deleteReviewOfBook);

export default router;
