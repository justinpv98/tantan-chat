import { Router } from "express";
import isAuthenticated from "@/middleware/isAuthenticated";
import validateRequest from "@/middleware/validateRequest";

import {
  createConversation,
  getConversation,
  getMessages
} from "@/controllers/conversationController";

const router = Router();

router.route("/").post(isAuthenticated, createConversation);

router.route("/:id").get(isAuthenticated, getConversation);

router.route("/:id/messages").get(isAuthenticated, getMessages);

export default router;
