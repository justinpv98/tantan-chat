import { Router } from "express";
import isAuthenticated from "@/middleware/isAuthenticated";

import { upload } from "@/storage/cloudinary";

import {
  createConversation,
  getConversation,
  getConversations,
  getMessages,
  postImage,
} from "@/controllers/conversationController";

const router = Router();

router
  .route("/")
  .get(isAuthenticated, getConversations)
  .post(isAuthenticated, createConversation);

router.route("/:id").get(isAuthenticated, getConversation);

router.route("/:id/messages").get(isAuthenticated, getMessages);

router
  .route("/:id/images")
  .post(isAuthenticated, upload.single("file"), postImage);

export default router;
