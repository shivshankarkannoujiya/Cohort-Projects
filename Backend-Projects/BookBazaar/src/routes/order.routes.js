import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    listUserOrders,
    getOrderDetailByOrderId,
    placeOrder,
    cancelOrder,
} from "../controllers/order.controllers.js";
import { verifyApiKey } from "../middlewares/apikey.middleware.js";

const router = Router();

router.route("/placeOrder").post(verifyJWT, placeOrder);
router.route("/listOrder").get(verifyJWT, verifyApiKey, listUserOrders);
router.route("/:orderId").get(verifyJWT, getOrderDetailByOrderId);
router.route("/:orderId/cancel").delete(verifyJWT, cancelOrder);

export default router;
