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
export const Payment = mongoose.model("Payment", paymentSchema);
