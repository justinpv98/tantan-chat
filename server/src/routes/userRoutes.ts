import { Router } from "express";
import isAuthenticated from "@/middleware/isAuthenticated";

import { upload } from "@/storage/cloudinary";

import {
  searchUsers,
  createRelationship,
  getRelationships,
  updateRelationship,
  deleteRelationship,
  getNotifications,
  readNotifications,
  changeProfilePicture,
} from "@/controllers/userController";

const router = Router();

router.route("/search").get(isAuthenticated, searchUsers);

router
  .route("/:id/profile_picture")
  .post(isAuthenticated, upload.single("file"), changeProfilePicture);

router
  .route("/:id/relationships")
  .get(isAuthenticated, getRelationships)
  .post(isAuthenticated, createRelationship);

router
  .route("/:id/relationships/:targetId")
  .put(isAuthenticated, updateRelationship)
  .delete(isAuthenticated, deleteRelationship);

router
  .route("/:id/notifications")
  .get(isAuthenticated, getNotifications)
  .put(isAuthenticated, readNotifications);

export default router;
