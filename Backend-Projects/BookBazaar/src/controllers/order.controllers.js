import { Book } from "../models/book.models.js";
import { Order } from "../models/order.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { OrderStatusEnum, UserRolesEnum } from "../utils/constant.js";

const placeOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
        throw new ApiError(400, "Order must contain at least one book");
    }

    if (
        !shippingAddress ||
        !shippingAddress.fullName ||
        !shippingAddress.phone ||
        !shippingAddress.addressLine1 ||
        !shippingAddress.city ||
        !shippingAddress.state ||
        !shippingAddress.postalCode ||
        !shippingAddress.country
    ) {
        throw new ApiError(400, "Complete shipping address is required");
    }

    let totalAmount = 0;

    for (const item of orderItems) {
        const book = await Book.findById(item.book);
        if (!book) {
            throw new ApiError(404, `Book not found: ${item.book}`);
        }

        totalAmount += book.price * (item.quantity || 1);
    }

    const order = await Order.create({
        user: req.user?._id,
        orderItems,
        shippingAddress,
        totalAmount,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, order, "Order placed successfully"));
});

// TODO: FIX
const listUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user?._id })
        .sort({ createdAt: -1 })
        .populate("orderItems.book", "title price author");

    if (orders.length === 0) {
        throw new ApiError(404, "Orders not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "User orders fetched successfully"));
});

const getOrderDetailByOrderId = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
        .populate("orderItems.book", "title price author")
        .populate("user", "name email");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (
        order.user?._id.toString() !== req.user?._id.toString() &&
        req.user?.role !== UserRolesEnum.ADMIN
    ) {
        throw new ApiError(403, "Not authorized to view this order");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, order, "Order details fetched successfully"),
        );
});

const cancelOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { reason } = req.body || "";

    if (!orderId) {
        throw new ApiError(400, "Order ID is required");
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (
        order.user?._id.toString() !== req.user?._id.toString() &&
        req.user?.role !== UserRolesEnum.ADMIN
    ) {
        throw new ApiError(403, "You are not authorized to cancel this order");
    }

    if (order.status === OrderStatusEnum.COMPLETED) {
        throw new ApiError(400, "Completed orders cannot be cancelled");
    }

    if (order.status === OrderStatusEnum.SHIPPED) {
        throw new ApiError(400, "Shipped orders cannot be cancelled");
    }

    if (order.cancelled?.isCancelled) {
        throw new ApiError(400, "This order is already cancelled");
    }

    order.status = OrderStatusEnum.CANCELLED;
    order.cancelled = {
        isCancelled: true,
        cancelledAt: new Date(),
        reason: reason || "Cancelled by user",
        cancelledBy: req.user?._id,
    };

    await order.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order cancelled successfully"));
});

export { placeOrder, listUserOrders, getOrderDetailByOrderId, cancelOrder };
