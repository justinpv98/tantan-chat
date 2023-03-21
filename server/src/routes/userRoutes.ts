import { Router } from "express";
import isAuthenticated from "@/middleware/isAuthenticated";

import {
  searchUsers,
  createRelationship,
  getRelationships,
  updateRelationship,
  deleteRelationship,
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

export default router;
