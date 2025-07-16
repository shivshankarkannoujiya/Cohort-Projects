import mongoose from "mongoose";
import {
    AvailablePaymentMethods,
    AvailablePaymentStatus,
    PaymentStatusEnum,
} from "../utils/constant";

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: [0, "Amount must be positive"],
        },

        paymentMethod: {
            type: String,
            enum: AvailablePaymentMethods,
            required: true,
        },

        status: {
            type: String,
            enum: AvailablePaymentStatus,
            default: PaymentStatusEnum.INITIATED,
        },

        transactionId: {
            type: String,
        },

        paidAt: {
            type: Date,
        },
    },
    { timestamps: true },
);

paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1, status: 1 });

export const Payment = mongoose.model("Payment", paymentSchema);
