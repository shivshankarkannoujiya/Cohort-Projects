import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions } from "../utils/constant.js";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if ([name, email, password].every((field) => field?.trim() === "")) {
        throw new ApiError(401, "All fields are required");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        throw new ApiError("User already Exist", 400);
    }

    const user = User.create({
        name,
        email,
        role,
        password,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, user, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(403, "All fields are required !!");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPassworCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Credential");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id,
    );
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken",
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken },
                "User loggedIn Successfully",
            ),
        );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User Fetched Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (incommingRefreshToken) {
        throw new ApiError(401, "Refresh Token is required");
    }

    try {
        const decodedToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );

        const user = await User.findById(decodedToken._id);
        if (!user) {
            throw new ApiError(401, "Invalid refresh Toekn");
        }

        if (incommingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh Toekn");
        }

        const { accessToken, refreshToken: newRefreshToken } =
            generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed Successfully",
                ),
            );
    } catch (error) {
        throw new ApiError(
            500,
            "Soomething went wrong while refreshing access token",
        );
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);

    const isPasswordValid = await user.isPassworCorrect(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(401, "Old password is Incorrect");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "password changed Successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        { new: true },
    );

    return res
        .status(200)
        .clearCookie("accessToken", accessToken, cookieOptions)
        .clearCookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, {}, "User logged Out successfully"));
});

export {
    registerUser,
    loginUser,
    getCurrentUser,
    changeCurrentPassword,
    refreshAccessToken,
    logoutUser,
};
