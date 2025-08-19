import { ApiKey } from "../models/api-key.models.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";

export const verifyApiKey = asyncHandler(async (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
        throw new ApiError(401, "API Key missing");
    }

    const hashedApiKey = crypto
        .createHash("sha256")
        .update(apiKey)
        .digest("hex");

    const existingApiKey = await ApiKey.findOne({
        key: hashedApiKey,
        is_active: true,
    });

    if (!existingApiKey) {
        throw new ApiError(401, "Invalid or inactive API Key");
    }

    if (existingApiKey.expiresAt < new Date()) {
        existingApiKey.is_active = false;
        await existingApiKey.save();
        throw new ApiError(401, "API Key has expired");
    }

    req.user = { id: existingApiKey.user };
    next();
});
