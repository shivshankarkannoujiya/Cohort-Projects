const UserRolesEnum = {
    ADMIN: "admin",
    USER: "user",
};

const OrderStatusEnum = {
    PENDING: "pending",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
};

const AvailableUserRoles = Object.values(UserRolesEnum);
const AvailableOrderStatus = Object.values(OrderStatusEnum);

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
    DB_NAME,
    cookieOptions,
};
