import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    listUserOrders,
    getOrderDetailByOrderId,
    placeOrder,
    cancelOrder,
} from "../controllers/order.controllers.js";

const router = Router();

router.route("/placeOrder").post(verifyJWT, placeOrder);
router.route("/listOrder").get(verifyJWT, listUserOrders);
router.route("/:orderId").get(verifyJWT, getOrderDetailByOrderId);
router.route("/:orderId/cancel").get(verifyJWT, cancelOrder);

export default router;
