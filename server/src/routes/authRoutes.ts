import { Router } from "express";
import validateRequest from "@/middleware/validateRequest";
import { loginSchema, registerSchema } from "@/validation";

import isAuthenticated from "@/middleware/isAuthenticated";

import { login, logout, register, checkSession } from "@/controllers/authController";

const router = Router();

router.route("/check-session").get(checkSession);

router.route("/register").post(validateRequest(registerSchema), register);

router.route("/login").post(validateRequest(loginSchema), login);

router.route("/logout").post(isAuthenticated, logout);


export default router;