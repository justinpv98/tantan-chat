import asyncHandler from "express-async-handler";
import logger from "@/logger";
import { Request, Response } from "express-serve-static-core";

import UserModel from "@/models/User";
import ConversationParticipantModel from "@/models/ConversationParticipant";
import RelationshipModel from "@/models/Relationship";
import socketEvents from "@/config/socketEvents";

// @desc    Search users by username
// @route   GET /api/users/search
// @access  Private
const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.query;

  const userQuery = await UserModel.findAll({
    select: ["id", "username", "profile_picture", "status"],
    where: { username: { like: username + "%" } },
  });

  if (!userQuery) {
    res.status(404);
    throw new Error("No users found");
  }

  res.status(200).json(userQuery);
});

// @desc    Get relationships for a user
// @route   GET /api/users/:id/friends
// @access  Private
const getRelationships = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (req.session.user.id != Number(id)) {
    res.status(401);
    throw new Error("User is not authorized to access relationships");
  }

  const relationships = await RelationshipModel.getRelationships(id);



  if (!relationships) {
    res.status(404);
    throw new Error("Existing relationships not found");
  }

  res.status(200).json(relationships);
});


// @desc    Create a relationship (e.g. send a friend request)
// @route   POST /api/users/:id/relationships
// @access  Private
const createRelationship = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { targetId } = req.body;

  if (req.session.user.id != Number(id)) {
    res.status(401);
    throw new Error("User is not authorized to access relationships");
  }

  const target = await UserModel.findById(targetId);
  if (!target) {
    res.status(400);
    throw new Error("Target user not found.");
  }

  const existingRelationship = await RelationshipModel.findAll({
    where: { actor: id, target: targetId },
  });

  if (existingRelationship) {
    res.status(409);
    throw new Error("Relationship already exists.");
  }

 
  const userToTargetRelationship = await RelationshipModel.createRelationship(id, targetId, 1)
  const targetToUserRelationship = await RelationshipModel.createRelationship(targetId, id, 2)


  const io = req.app.get("io");

  io.to(String(targetId)).emit(socketEvents.CREATE_RELATIONSHIP, targetToUserRelationship);


  res.status(200).json(userToTargetRelationship);
});

// @desc    Update a relationship (e.g. accept friend request, block user)
// @route   PUT /api/users/:id/relationships/:targetId
// @access  Private
const updateRelationship = asyncHandler(async (req: Request, res: Response) => {
  const { id, targetId } = req.params;
  const { type } = req.body;

  if (req.session.user.id != Number(id)) {
    res.status(401);
    throw new Error("User is not authorized to access relationships");
  }


  if (type != 3 && type != 4) {
    res.status(400);
    throw new Error("Unaccepted relationship type");
  }

  const target = await UserModel.findById(targetId);
  if (!target) {
    res.status(400);
    throw new Error("Target user not found.");
  }

  const existingRelationship = await RelationshipModel.findAll({
    select: ["id"],
    where: { actor: id, target: targetId },
  });

  const existingReverseRelationship = await RelationshipModel.findAll({
    select: ["id"],
    where: { actor: targetId, target: id },
  });

  if (!existingRelationship || !existingReverseRelationship) {
    res.status(404);
    throw new Error("Relationship not found.");
  }

  const updatedRelationship = await RelationshipModel.updateById(
    existingRelationship[0].id,
    {
      set: {
        type,
      },
      returning: ["id", "type"]
    }
  );

  const updatedTargetToUserRelationship = await RelationshipModel.updateById(
    existingReverseRelationship[0].id,
    {
      set: {
        type,
      },
      returning: ["id", "type"]
    }
  );

  const io = req.app.get("io");
  io.to(String(targetId)).emit(
    socketEvents.UPDATE_RELATIONSHIP,
    updatedTargetToUserRelationship
  );

  res.status(200).json(updatedRelationship);
});

// @desc    Delete a relationship (e.g. unfriend, reject friend request)
// @route   DELETE /api/users/:id/relationships/:targetId
// @access  Private
const deleteRelationship = asyncHandler(async (req: Request, res: Response) => {
  const { id, targetId } = req.params;

  if (req.session.user.id != Number(id)) {
    res.status(401);
    throw new Error("User is not authorized to access relationships");
  }

  const target = await UserModel.findById(targetId);
  if (!target) {
    res.status(400);
    throw new Error("Target user not found.");
  }

  const userToTargetRelationships = await RelationshipModel.deleteAll({
    where: { actor: id, target: targetId }, returning: ["id"]
  });

  const targetToUserRelationships = await RelationshipModel.deleteAll({
    where: { actor: targetId, target: id }, returning: ["id"]
  });

  const io = req.app.get("io");

  io.to(String(targetId)).emit(socketEvents.REMOVE_RELATIONSHIP, targetToUserRelationships[0].id);
  
  res.status(200).json(userToTargetRelationships[0]);
});

export {
  createRelationship,
  searchUsers,
  getRelationships,
  updateRelationship,
  deleteRelationship,
};
