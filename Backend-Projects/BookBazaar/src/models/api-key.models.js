import mongoose from "mongoose";

const apikeySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        key: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        expiresAt: {
            type: Date,
        },
    },
    { timestamps: true },
);
export const ApiKey = mongoose.model("ApiKey", apikeySchema);
