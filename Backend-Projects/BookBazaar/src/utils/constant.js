const UserRolesEnum = {
    ADMIN: "admin",
    USER: "user",
};

const AvailableUserRoles = Object.values(UserRolesEnum);

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
    DB_NAME,
    cookieOptions
}