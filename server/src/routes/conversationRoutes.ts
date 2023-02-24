import { Router } from "express";
import isAuthenticated from "@/middleware/isAuthenticated";
import validateRequest from "@/middleware/validateRequest";

import {
  createConversation,
  getConversation,
} from "@/controllers/conversationController";

const router = Router();

router.route("/").post(isAuthenticated, createConversation);

router.route("/:id").get(isAuthenticated, getConversation);

export default router;
