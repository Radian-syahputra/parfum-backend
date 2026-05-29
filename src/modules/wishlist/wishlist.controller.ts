import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { successResponse, errorResponse } from "../../utils/response";
import {
  addToWishlistService,
  getMyWishListService,
  removeFromWishlistService,
} from "./wishlist.service";

export const addToWishlistController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { productId } = req.body;
    const userId = req.user!.id;

    if (!productId) {
      return errorResponse(res, "ProductId harus diisi", 400);
    }

    const wishlist = await addToWishlistService(userId, productId);

    return successResponse(
      res,
      "Produk berhasil ditambahkan ke wishlist",
      wishlist,
      201
    );
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

export const getMyWishlistController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;

    const wishlist = await getMyWishListService(userId);
    return successResponse(res, "Berhasil mengambil wishlist", wishlist);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};


export const removeFromWishlistController = async (req : AuthRequest, res : Response) => {
    try {
        const {id} = req.params
        const userId = req.user!.id

        const wishlist = await removeFromWishlistService(id as string, userId)

        return successResponse(res, "Produk berhasil dihapus dari wishlist", wishlist)

    } catch (error : any) {
        return errorResponse(res, error.message, 400);
    }
}