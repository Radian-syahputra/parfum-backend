import { Router } from "express";
import {
  createOrderController,
  getMyOrderController,
  getOrderByIdController,
  getAllOrdersController,
  updateOrderStatusController,
} from "./order.controller";
import { authenticate } from "../../middlewares/auth";
import { authorizeAdmin } from "../../middlewares/role";

const router = Router();

// Customer routes
router.post("/", authenticate, createOrderController);
router.get("/my-orders", authenticate, getMyOrderController);
router.get("/:id", authenticate, getOrderByIdController);

// Admin routes
router.get("/", authenticate, authorizeAdmin, getAllOrdersController);
router.patch("/:id/status", authenticate, authorizeAdmin, updateOrderStatusController);

export default router;