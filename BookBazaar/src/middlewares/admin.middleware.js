import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const validatePermission = (roles = []) =>
    asyncHandler(async (req, _, next) => {
        const userRole = req.user?.role;
        if (!userRole) {
            throw new ApiError(401, "User role not found in request");
        }

        if (!roles.includes(userRole)) {
            throw new ApiError(
                403,
                "You do not have permission to perform this action",
            );
        }

        next();
    });
