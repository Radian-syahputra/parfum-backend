import { Request, Response } from "express";
import { loginService, registerService } from "./auth.service";
import { errorResponse, successResponse } from "../../utils/response";
import { AuthRequest } from "../../middlewares/auth";

export const RegisterController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, "Semua Field Harus Di Isi", 400);
    }

    const user = await registerService(name, email, password);
    return successResponse(res, "Registrasi Berhasil", user, 201);
  } catch (error : any) {
    return errorResponse(res, error.message, 400);
  }
};

export const LoginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Semua Field Harus Di Isi", 400);
    }

    const { token, user } = await loginService(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    return successResponse(res, "Login Berhasil", user);
  } catch (error : any) {
    return errorResponse(res, error.message, 400);
  }
};

export const LogoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return successResponse(res, "Logout Berhasil");
  } catch (error : any) {
    return errorResponse(res, error.message, 500);
  }
};

export const GetMeController = async (req: AuthRequest, res: Response) => {
  try {
    return successResponse(res, "Data User Berhasil Di Ambil", req.user)
  } catch (error : any) {
    return errorResponse(res, error.message, 500);
  }
};
