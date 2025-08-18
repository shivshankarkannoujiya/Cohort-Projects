import { Router } from "express";
import {
    addItemToCart,
    getCartItems,
    removeCartItem,
    updateCartItem,
} from "../controllers/cart.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add").post(verifyJWT, addItemToCart);
router.route("/").get(verifyJWT, getCartItems);
router.route("/:id").put(verifyJWT, updateCartItem);
router.route("/:id").delete(verifyJWT, removeCartItem);

export default router;
