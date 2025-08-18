import { ApiKey } from "../models/api-key.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";

const generateNewApiKey = asyncHandler(async (req, res) => {
    try {
        const user = req?.user;

        const newApiKey = crypto.randomBytes(32).toString("hex");
        const hashedApiKey = crypto
            .createHash("sha256")
            .update(newApiKey)
            .digest("hex");

        const apiKey = await ApiKey.create({
            key: hashedApiKey,
            user: user._id,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            is_active: true,
        });

        return res.status(201).json(
            new ApiResponse(
                200,
                {
                    apiKey,
                    expiresAt: apiKey.expiresAt,
                },
                "New API key generated successfully. Please save it",
            ),
        );
    } catch (error) {
        console.error("Error in API key generation:", error);
        throw new ApiError(500, "Server Error: Could not generate API key.");
    }
});


export { generateNewApiKey }