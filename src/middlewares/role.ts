import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import { errorResponse } from "../utils/response";


export const authorizeAdmin = (req : AuthRequest, res : Response, next : NextFunction) => {
        if(req.user.role !== 'ADMIN') {
           return errorResponse(res, "Akses ditolak, hanya admin", 403);
        }
        next()
}