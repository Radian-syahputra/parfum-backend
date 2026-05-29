import { Router } from "express";
import {GetMeController,LoginController,LogoutController,RegisterController} from './auth.controller'
import {authenticate} from '../../middlewares/auth'

const router = Router()

router.post("/register", RegisterController)
router.post("/login", LoginController)
router.post("/logout", LogoutController)
router.get('/me',authenticate, GetMeController)

export default router