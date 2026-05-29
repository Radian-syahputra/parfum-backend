import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { successResponse, errorResponse } from "../../utils/response";
import { getMyNotifcationService,markAllAsReadService,markAsReadService } from "./notification.service";


export const getMyNotifcationController = async (req :AuthRequest, res : Response) => {
    try {
        const userId = req.user!.id
        const notification = await getMyNotifcationService(userId)
        return successResponse(res, "Berhasil Mengambil Notification", notification)

    } catch (error : any) {
        return errorResponse(res, error.message, 500)
    }
}

export const markAsReadController = async (req : AuthRequest, res : Response) => {
    try {
        const userId = req.user!.id
        const {id} = req.params

        const notification = await markAsReadService(id as string, userId);
        return successResponse(res, "Notifikasi berhasil dibaca", notification)
    } catch (error : any) {
        return errorResponse(res, error.message, 500)
    }
}

export const markAllAsReadController = async (req : AuthRequest, res : Response) => {
    try {
        const userId = req.user!.id
        const result  = await markAllAsReadService(userId)

        return successResponse(res, "Semua Notifikasi sudah di baca", result)

    } catch (error : any) {
        return errorResponse(res, error.message, 500)
    }
}