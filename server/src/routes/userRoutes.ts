import { Router } from "express";
import isAuthenticated from "@/middleware/isAuthenticated";
import validateRequest from "@/middleware/validateRequest";

import { searchUsers } from "@/controllers/userController";

const router = Router();

router.route("/search").get(isAuthenticated, searchUsers);

export default router;
