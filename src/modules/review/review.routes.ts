import { Router } from "express";
import { createReviewController,deleteReviewController,getProductReviewController } from "./review.controller";
import { authenticate } from "../../middlewares/auth";

const router = Router()

router.post('/', authenticate, createReviewController)
router.get('/:productId', getProductReviewController)
router.delete('/:id', authenticate, deleteReviewController)

export default router