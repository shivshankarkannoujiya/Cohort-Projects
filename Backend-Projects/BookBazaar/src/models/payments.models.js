import mongoose from "mongoose";

const payemntSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["credit_card", "paypal", "upi", "mock_gateway"],
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["initiated", "successful", "failed"],
            default: "initiated",
        },

        transactionId: {
            type: String,
        },
    },
    { timestamps: true },
);
export const Payment = mongoose.model("Payment", payemntSchema);
