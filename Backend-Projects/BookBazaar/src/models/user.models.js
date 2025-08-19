import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constant.js";


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxLength: [50, "Name cannot exceed 50 character"],
        },

        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            match: [
                /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/,
                "Please provide a valid email",
            ],
        },

        password: {
            type: String,
            required: [true, "password is required"],
            minLength: [8, "password must be atleast 8 character"],
        },

        role: {
            type: String,
            enum: AvailableUserRoles,
            default: UserRolesEnum.USER,
        },

        refreshToken: {
            type: String,
        },
    },
    { timestamps: true },
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    try {
        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                role: this.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
        );
    } catch (error) {
        console.error("ERROR WHILE GENERATING ACCESS TOKEN");
    }
};

userSchema.methods.generateRefreshToken = function () {
    try {
        return jwt.sign(
            {
                _id: this._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
        );
    } catch (error) {
        console.error("ERROR WHILE REFRESH ACCESS TOKEN");
    }
};

export const User = mongoose.model("User", userSchema);
