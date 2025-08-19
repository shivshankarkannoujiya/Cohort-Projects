import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },

        quantity: {
            type: Number,
            default: 1,
        },
    },
    { timestamps: true },
);
export const CartItem = mongoose.model("CartItem", cartItemSchema);
