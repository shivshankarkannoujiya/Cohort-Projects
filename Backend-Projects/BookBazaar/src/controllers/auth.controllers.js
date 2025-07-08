import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions } from "../utils/constant.js";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js";

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

const getCurrentUser = asyncHandler(async (req, res) => {});
const logoutUser = asyncHandler(async (req, res) => {});

export { registerUser, loginUser, getCurrentUser, logoutUser };
