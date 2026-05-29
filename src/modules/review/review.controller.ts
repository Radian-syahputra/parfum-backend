import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { successResponse, errorResponse } from "../../utils/response";
import {
  createReviewService,
  deleteReviewService,
  getProductReviewService,
} from "./review.service";

export const createReviewController = async (req : AuthRequest, res :Response) => {
    try {
        const userId = req.user!.id
        const {productId, rating, comment} = req.body

        if(!productId || !rating) {
            return errorResponse(res, "Product dan rating harus di isi", 400)
        }

        if(rating < 0 || rating > 5) {
            return errorResponse(res, "Rating harus antara 1 sampai 5", 400);
        }

        const review = await createReviewService(userId, productId, rating, comment)
        return successResponse(res, "Review Berhasil Di Tambahkan", review, 201)
    } catch (error : any) {
        return errorResponse(res, error.message, 400 )
    }
}

export const getProductReviewController = async (req : AuthRequest, res : Response) => {
    try {
        const {productId} = req.params
        const result = await getProductReviewService(productId as string)
        return successResponse(res, "Berhasil Mengambil Review", result)
    } catch (error : any) {
        return errorResponse(res, error.message, 400 )

    }
}

export const deleteReviewController = async (req : AuthRequest, res : Response) =>  {
    try {
        const {id} = req.params
        const userId = req.user!.id
        const role = req.user!.role

        const review = await deleteReviewService(id as string, userId, role)
        return successResponse(res, "Review Berhasil Di Hapus", review)

    } catch (error : any) {
        return errorResponse(res, error.message, 400 )
        
    }
}