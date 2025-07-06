import mongoose from "mongoose";

const payemntSchema = new mongoose.Schema({}, { timestamps: true });
export const Payment = mongoose.model("Payment", payemntSchema)