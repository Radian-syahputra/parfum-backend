import { Response } from "express";
import {
  createOrderService,
  getAllOrdersService,
  getMyOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
} from "./order.service";
import { successResponse, errorResponse } from "../../utils/response";
import { AuthRequest } from "../../middlewares/auth";
import { OrderStatus } from "@prisma/client";

export const createOrderController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return errorResponse(res, "Item Pesanan Tidak Boleh Kosong", 400);
    }

    const order = await createOrderService(userId, items);
    return successResponse(res, "Pesanan Berhasil Di Buat", order, 201);
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};

export const getMyOrderController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orders = await getMyOrdersService(userId);

    return successResponse(res, "Berhasil Mengambil Pesanan", orders);
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};

export const getOrderByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;
    const order = await getOrderByIdService(id as string, userId, role);

    return successResponse(res, "Berhasil Mengambil Pesanan", order);
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAllOrdersController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const orders = await getAllOrdersService();
    return successResponse(res, "Berhasil Mengambil Semua Pesanan", orders);
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateOrderStatusController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return errorResponse(res, "Status harus diisi", 400);
    }

    const order = await updateOrderStatusService(id as string, status as OrderStatus);
    return successResponse(res, "Status pesanan berhasil diupdate", order);
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};
