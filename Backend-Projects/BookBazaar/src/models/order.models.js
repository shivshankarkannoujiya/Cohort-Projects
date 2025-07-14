import mongoose from "mongoose";
import { OrderStatusEnum, AvailableOrderStatus } from "../utils/constant.js";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                book: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Book",
                    required: true,
                },
                quantity: { type: Number, default: 1 },
            },
        ],

        totalAmount: {
            type: Number,
        },

        status: {
            type: String,
            enum: AvailableOrderStatus,
            default: OrderStatusEnum.PENDING,
        },
    },
    { timestamps: true },
);
export const Order = mongoose.model("Order", orderSchema);
