import { Router } from "express";
import isAuthenticated from "@/middleware/isAuthenticated";

import {
  searchUsers,
  createRelationship,
  getRelationships,
  updateRelationship,
  deleteRelationship,
  getNotifications,
  readNotifications,
} from "@/controllers/userController";

const router = Router();

router.route("/search").get(isAuthenticated, searchUsers);

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
