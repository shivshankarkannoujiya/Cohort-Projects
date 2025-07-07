import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
        },
    },
    { timestamps: true },
);
export const Review = mongoose.model("Review", reviewSchema);
