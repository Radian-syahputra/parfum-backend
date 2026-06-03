import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { successResponse, errorResponse } from "../../utils/response";
import {
  getDashboardStatsService,
  deleteUserService,
  getAllUserService,
  updateUserRoleService,
} from "./admin.service";

export const getDashboardStatsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const stats = await getDashboardStatsService();
    return successResponse(
      res,
      "Berhasil mengambil statistik dashboard",
      stats
    );
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAllUserController = async (req: AuthRequest, res: Response) => {
  try {
    const users = await getAllUserService();
    return successResponse(res, "Berhasil mengambil semua user", users);
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteUserController = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await deleteUserService(id as string);
    return successResponse(res, "User Berhasil Di Hapus", user);
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateUserRoleController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const role = req.body;

    if (!role || !["ADMIN", "CUSTOMER"].includes(role)) {
      return errorResponse(res, "Role tidak valid", 400);
    }

    const user = await updateUserRoleService(
      id as string,
      role as "ADMIN" | "CUSTOMER"
    );
    return successResponse(res, "Role user berhasil diupdate", user);
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};
