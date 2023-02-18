import { Router } from "express";
import validateRequest from "@/middleware/validateRequest";
import { loginSchema, registerSchema } from "@/validation";

import { login, register, checkSession } from "@/controllers/authController";

const router = Router();

router.route("/check-session").get(checkSession);

router.route("/register").post(validateRequest(registerSchema), register);

router.route("/login").post(validateRequest(loginSchema), login);

export default router;