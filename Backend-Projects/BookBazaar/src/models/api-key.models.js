import mongoose from "mongoose";

const apikeySchema = new mongoose.Schema({}, { timestamps: true });
export const ApiKey = mongoose.model("ApiKey", apikeySchema)