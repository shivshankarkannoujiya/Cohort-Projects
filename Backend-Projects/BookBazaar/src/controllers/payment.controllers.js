import { Order } from "../models/order.models.js";
import { Payment } from "../models/payments.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
    PaymentMethodEnum,
    OrderStatusEnum,
    PaymentStatusEnum,
} from "../utils/constant.js";
import crypto from "crypto";

const createPayment = asyncHandler(async (req, res) => {
    const { orderId, amount } = req.body;
    const userId = req.user?._id;

    try {
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        if (order.status !== OrderStatusEnum.PENDING) {
            throw new ApiError(404, "Payment cannot be created for this order");
        }

        const fakeTransactionId = `pay_${crypto.randomBytes(12).toString("hex")}`;
        await Payment.create({
            order: orderId,
            user: userId,
            amount,
            paymentMethod: PaymentMethodEnum.MOCK_GATEWAY,
            transactionId: fakeTransactionId,
            status: PaymentStatusEnum.INITIATED,
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    paymentId: fakeTransactionId,
                    orderId: orderId,
                },
                "Mock payment initiated successfully",
            ),
        );
    } catch (error) {
        console.error("Error While Creating Mock Payment: ", error);
        throw new ApiError(500, "internal Server Error");
    }
});

const verifyPayment = asyncHandler(async (req, res) => {
    const { paymentId } = req.body;
    const userId = req.user._id;

    try {
        const payment = await Payment.findOne({
            transactionId: paymentId,
            user: userId,
            status: PaymentStatusEnum.INITIATED,
        });

        if (!payment) {
            throw new ApiError(404, "Payment not found or already verified");
        }

        payment.status = PaymentStatusEnum.SUCCESSFULL;
        payment.paidAt = new Date();
        await Payment.bulkSave();

        const order = await Order.findById(payment.order);
        if (order) {
            order.status = OrderStatusEnum.COMPLETED;
            await order.save();
        }

        return res.status(200).json(
            new ApiResponse(200, {
                paymentStatus: PaymentStatusEnum.SUCCESSFULL,
            }),
            "Mock payment verified successfully",
        );
    } catch (error) {
        console.error("Error While Verifying Mock Payment: ", error);
        throw new ApiError(500, "internal Server Error");
    }
});

export { createPayment, verifyPayment };
