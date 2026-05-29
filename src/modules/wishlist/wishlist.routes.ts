import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import {
  addToWishlistController,
  getMyWishlistController,
  removeFromWishlistController,
} from "./wishlist.controller";

const router = Router();

router.post("/", authenticate, addToWishlistController);
router.get("/", authenticate, getMyWishlistController);
router.delete("/:id", authenticate, removeFromWishlistController);

export default router;
