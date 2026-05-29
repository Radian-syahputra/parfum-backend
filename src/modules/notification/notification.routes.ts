import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { getMyNotifcationController,markAllAsReadController,markAsReadController } from "./notification.controller";

const router = Router()

router.get('/', authenticate, getMyNotifcationController)
router.patch('/:id/read', authenticate, markAsReadController)
router.patch('/read-all', authenticate, markAllAsReadController)

export default router