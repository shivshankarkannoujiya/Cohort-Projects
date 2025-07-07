import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        author: {
            type: String,
            required: true,
        },

        description: {
            type: String,
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
        },

        coverImageUrl: {
            type: String,
        },
    },
    { timestamps: true },
);
export const Book = mongoose.model("Book", bookSchema);
