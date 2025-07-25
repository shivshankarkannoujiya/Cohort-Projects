import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        author: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
        },

        stockQuantity: {
            type: Number,
            default: 0,
        },

        genre: {
            type: String,
            required: true,
            trim: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        coverImageUrl: {
            type: String,
        },
    },
    { timestamps: true },
);
export const Book = mongoose.model("Book", bookSchema);
