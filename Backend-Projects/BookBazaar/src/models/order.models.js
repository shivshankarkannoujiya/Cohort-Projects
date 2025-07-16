import mongoose from "mongoose";
import { OrderStatusEnum, AvailableOrderStatus } from "../utils/constant.js";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderItems: [
            {
                book: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Book",
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: [1, "Quantity must be at least 1"],
                },
            },
        ],

        totalAmount: {
            type: Number,
            min: 0,
        },

        status: {
            type: String,
            enum: AvailableOrderStatus,
            default: OrderStatusEnum.PENDING,
        },

        cancelled: {
            isCancelled: {
                type: Boolean,
                default: false,
            },

            cancelledAt: {
                type: Date,
            },

            reason: {
                type: String,
            },

            cancelledBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        },

        shippingAddress: {
            fullName: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            addressLine1: {
                type: String,
                required: true,
            },

            addressLine2: {
                type: String,
            },

            city: {
                type: String,
                required: true,
            },

            state: {
                type: String,
                required: true,
            },

            postalCode: {
                type: String,
                required: true,
            },

            country: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true },
);
export const Order = mongoose.model("Order", orderSchema);
