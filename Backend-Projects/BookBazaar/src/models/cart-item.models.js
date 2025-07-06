import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({}, { timestamps: true });
export const CartItem = mongoose.model("CartItem", cartItemSchema)