import asyncHandler from "express-async-handler";
import logger from "@/logger";
import { Request, Response } from "express-serve-static-core";
import { uploadImage } from "@/storage/cloudinary";

import UserModel from "@/models/User";
import RelationshipModel from "@/models/Relationship";
import NotificationModel, { Notification } from "@/models/Notification";

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

// @desc    Get notifications for a user
// @route   GET /api/users/:id/notifications
// @access  Private
const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (req.session.user.id != Number(id)) {
    res.status(401);
    throw new Error("User is not authorized to access notifications");
  }

  const notifications = await NotificationModel.getNotifications(Number(id))

  if (!notifications) {
    res.status(404);
    throw new Error("Existing notifications not found");
  }

  res.status(200).json(notifications);
});

// @desc    Change a user's profile picture
// @route   POST /api/users/:id/profile_picture
// @access  Private
const changeProfilePicture = asyncHandler(async (req: Request & {file: any}, res: Response) => {
  const {id} = req.params;
  const {id: userId, username} = req.session.user;
  const { file } = req;

  if(userId !== Number(id)){
    res.status(409)
    throw new Error("User is not authorized to change profile picture")
  }

  try {
    const storedImage = await uploadImage(file, `/${username}`, {eager: "w_128,h_128,c_thumb,g_auto"});
    const profile_picture = (storedImage as any).secure_url;

    const updatedUser = await  UserModel.updateById(id, {
      set: {
        profile_picture
      },
      returning: ["id", "username", "profile_picture", "status"]
    })

    req.session.user.profile_picture = updatedUser.profile_picture;
    await req.session.save();

    if(!updatedUser){
      res.status(400)
      throw new Error("User could not be updated.")
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500);
    throw new Error("Server error.");
  }
} 
)

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

  const userToTargetRelationship = await RelationshipModel.createRelationship(
    id,
    targetId,
    1
  );
  const targetToUserRelationship = await RelationshipModel.createRelationship(
    targetId,
    id,
    2
  );

  const relationshipNotification = new Notification({
    type: 1,
    actor: Number(id),
    target: targetId,
    read: false,
  });
  await relationshipNotification.save();

  relationshipNotification.actor = req.session.user;
  delete relationshipNotification.actor.password;
  delete relationshipNotification.actor.email;

  const io = req.app.get("io");

  io.to(String(targetId)).emit(
    socketEvents.CREATE_RELATIONSHIP,
    targetToUserRelationship
  );
  io.to(String(targetId)).emit(
    socketEvents.SEND_NOTIFICATION,
    relationshipNotification
  );

  res.status(200).json(userToTargetRelationship);
});

// @desc    Read all users notifications
// @route   PUT /api/users/:id/notifications
// @access  Private
const readNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;


  if (req.session.user.id != Number(id)) {
    res.status(401);
    throw new Error("User is not authorized to access notifications");
  }

  const notifications = await NotificationModel.updateAll({
    set: { read: true },
    where: { target: id },
  });

  if (!notifications) {
    res.status(404);
    throw new Error("Notifications not found");
  }

  res.status(200).json(notifications);
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
      returning: ["id", "type"],
    }
  );

  const updatedTargetToUserRelationship = await RelationshipModel.updateById(
    existingReverseRelationship[0].id,
    {
      set: {
        type,
      },
      returning: ["id", "type"],
    }
  );

  await NotificationModel.deleteAll({
    where: { actor: Number(targetId), target: Number(id), type: 1 },
  });

  const io = req.app.get("io");

  if (type == 3) {
    const notification = new Notification({
      type: 2,
      actor: Number(id),
      target: Number(targetId),
      read: false,
    });
    
    await notification.save();

    notification.actor = req.session.user;
    delete notification.actor.password;
    delete notification.actor.email;
    
    io.to(String(targetId)).emit(socketEvents.SEND_NOTIFICATION, notification);
  }

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
    where: { actor: id, target: targetId },
    returning: ["id"],
  });

  const targetToUserRelationships = await RelationshipModel.deleteAll({
    where: { actor: targetId, target: id },
    returning: ["id"],
  });

  const io = req.app.get("io");

  io.to(String(targetId)).emit(
    socketEvents.REMOVE_RELATIONSHIP,
    targetToUserRelationships[0].id
  );

  res.status(200).json(userToTargetRelationships[0]);
});

export {
  createRelationship,
  changeProfilePicture,
  searchUsers,
  getRelationships,
  getNotifications,
  updateRelationship,
  readNotifications,
  deleteRelationship,
};
