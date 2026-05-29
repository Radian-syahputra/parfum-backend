import {
  createProductController,
  deleteProductController,
  getAllProductController,
  getProductByIdController,
  updateProductByIdController,
} from "./product.controller";
import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { authorizeAdmin } from "../../middlewares/role";
import upload from "../../config/multer";


const router = Router()

// Public Routes
router.get('/', getAllProductController)
router.get('/:id', getProductByIdController)

// Admin Routes
router.post('/', authenticate, authorizeAdmin, upload.single("image"), createProductController)
router.put('/:id', authenticate, authorizeAdmin, upload.single("image"), updateProductByIdController)
router.delete('/:id', authenticate, authorizeAdmin, deleteProductController)


export default router
