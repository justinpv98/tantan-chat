import asyncHandler from "express-async-handler";
import logger from "@/logger";
import { Request, Response } from "express-serve-static-core";

import ConversationModel, { Conversation } from "@/models/Conversation";
import ConversationParticipantModel, { ConversationParticipant } from "@/models/ConversationParticipant";

// @desc    Create a new conversation between users
// @route   POST /api/conversations
// @access  Private
const createConversation = asyncHandler(async (req: Request, res: Response) => {
  const { targetId } = req.body;
  const { id } = req.session.user;

  if(id == targetId){
    res.status(401)
    throw new Error("Forbidden to create conversation with self")
  }

  const participants = [id, targetId];

  const conversation = await ConversationParticipantModel.findConversationId(participants)

  if (conversation) {
    // if conversation exists, send conversation info

    res.status(200).json({ id: conversation });
  } else {
    // If there is no existing conversation between users, create a new one

    const newConversation = new Conversation({ type: "1" });
    await newConversation.save();

    // Add participants to conversation
    const populatedParticipants = participants.map(async (participant) => {
      const newParticipant = new ConversationParticipant({
        conversation: newConversation.id,
        user: participant,
      });

      await newParticipant.save();

      return newParticipant;
    });

    logger.info(
      `Conversation #${newConversation.id} created between participants - ${participants.sort().map(p => "#" + p)} `
    );

    res.status(201).json({ id: newConversation.id });
  }
});

// @desc    Get a conversation
// @route   GET /api/conversations/:id
// @access  Private
const getConversation = asyncHandler(async (req: Request, res: Response) => {
  const { id: conversationId } = req.params;
  const { id: userId } = req.session.user;

  const conversation = await ConversationModel.findExistingConversation(
    conversationId
  );

  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  const userIsInConversation = conversation.participants.some(
    (participant) => participant.id == userId
  );

  if (!userIsInConversation) {
    res.status(401);
    throw new Error("User is forbidden from conversation");
  }

  res.status(200).json(conversation);
});

export { createConversation, getConversation };
