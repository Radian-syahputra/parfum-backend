import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { authorizeAdmin } from "../../middlewares/role";
import { getDashboardStatsController,deleteUserController,getAllUserController,updateUserRoleController } from "./admin.controller";

const router = Router()

// Semua route admin harus login dan role ADMIN
router.use(authenticate, authorizeAdmin);

router.get("/dashboard", getDashboardStatsController);
router.get("/users", getAllUserController);
router.delete("/users/:id", deleteUserController);
router.patch("/users/:id/role", updateUserRoleController);

export default router

