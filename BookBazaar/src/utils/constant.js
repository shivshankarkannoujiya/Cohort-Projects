const UserRolesEnum = {
    ADMIN: "admin",
    USER: "user",
};

const OrderStatusEnum = {
    PENDING: "pending",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    SHIPPED: "shipped"
};

const PaymentMethodEnum = {
    CREDIT_CARD: "credit_card",
    PAYPAL: "paypal",
    UPI: "upi",
    MOCK_GATEWAY: "mock_gateway",
};

const PaymentStatusEnum = {
    INITIATED: "initiated",
    SUCCESSFULL: "successful",
    FAILED: "failed",
};

const AvailableUserRoles = Object.values(UserRolesEnum);
const AvailableOrderStatus = Object.values(OrderStatusEnum);
const AvailablePaymentMethods = Object.values(PaymentMethodEnum);
const AvailablePaymentStatus = Object.values(PaymentStatusEnum);

const DB_NAME = "BookBazaar";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
};

export {
    UserRolesEnum,
    AvailableUserRoles,
    OrderStatusEnum,
    AvailableOrderStatus,
    AvailablePaymentMethods,
    AvailablePaymentStatus,
    PaymentMethodEnum,
    PaymentStatusEnum,
    DB_NAME,
    cookieOptions,
};
