import mongoose from "mongoose";
import { Review } from "../models/review.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addReviewToBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must me between 1 to 5");
    }

    const existingReview = await Review.findOne({
        book: bookId,
        user: req.user?._id,
    });

    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this book");
    }

    const review = await Review.create({
        book: bookId,
        user: req.user?._id,
        rating,
        comment,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, review, "Review added successfully"));
});

const listReviewOfBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params;

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
        throw new ApiError("Invalid or missing bookId");
    }

    const reviews = await Review.find({
        book: bookId,
    })
        .sort({ createdAt: -1 })
        .populate("user", "name");

    if (!reviews) {
        throw new ApiError(404, "No Reviews Found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, reviews, "Book Review fetched successfully"),
        );
});

const deleteReviewOfBook = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new ApiError(400, "Invalid or Missing review id");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(404, "Review No found");
    }

    // Check Ownership
    if (review.user.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You can only delete your own review");
    }

    await review.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Review deleted successfully"));
});

export { addReviewToBook, listReviewOfBook, deleteReviewOfBook };
