import { Request, Response } from "express";
import {
  createProductService,
  deleteProductService,
  getAllProductService,
  getProductByIdService,
  updateProductByIdService,
} from "./product.service";
import { successResponse, errorResponse } from "../../utils/response";
import { Category } from "@prisma/client";

export const createProductController = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !stock || !category) {
      return errorResponse(res, "Semua field harus diisi", 400);
    }

    const file = req.file;

    const product = await createProductService(
      name,
      description,
      parseFloat(price),
      parseInt(stock),
      category as Category,
      file?.buffer,
      file?.originalname
    );

    return successResponse(res, "Product Berhasil Di Tambahkan", product, 201);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

export const getAllProductController = async (req: Request, res: Response) => {
  try {
    const { search, category } = req.query;

    const products = await getAllProductService(
      search as string,
      category as Category
    );

    return successResponse(res, "Berhasil Mengambil Semua Product", products);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id as string);

    return successResponse(res, "Berhasil Mengambil Product", product);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

export const updateProductByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const file = req.file;

    const product = await updateProductByIdService(
      id as string,
      {
        name,
        description,
        ...(price && { price: parseFloat(price) }),
        ...(stock && { stock: parseInt(stock) }),
        ...(category && { category: category as Category }),
      },
      file?.buffer,
      file?.originalname
    );

    return successResponse(res, "Product Berhasil Di Update", product);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await deleteProductService(id as string);
    return successResponse(res, "Berhasil Menghapus ");
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};
