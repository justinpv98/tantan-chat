import asyncHandler from "express-async-handler";
import logger from "@/logger";
import { Request, Response } from "express-serve-static-core";

// Constants
import socketEvents from "@/config/socketEvents";

// Models
import ConversationModel, { Conversation } from "@/models/Conversation";
import ConversationParticipantModel, {
  ConversationParticipant,
} from "@/models/ConversationParticipant";
import MessageModel, { Message } from "@/models/Message";

// Helpers
import { uploadImage } from "@/storage/cloudinary";

interface ReqWithFiles extends Response {
  files: File[];
}

// @desc    Create a new conversation between users
// @route   POST /api/conversations
// @access  Private
const createConversation = asyncHandler(async (req: Request, res: Response) => {
  const { targetIds, type } = req.body;
  const { id } = req.session.user;

  if (!Array.isArray(targetIds)) {
    res.status(422);
    throw new Error("Target ids must be in an array");
  }

  if (targetIds.map(Number).includes(Number(id))) {
    res.status(422);
    throw new Error("Can not create conversation with self as target");
  }

  const participants = Array.from(new Set([id, ...targetIds]));

  let conversationId;

  if (type == "1") {
    // if conversation exists, send conversation info
    conversationId = await ConversationParticipantModel.findConversationId(
      participants
    );

    if (conversationId) {
      res.status(200).json({ id: conversationId });
      return;
    }
  }

  // If there is no existing conversation between users, create a new one

  let newConversation;
  if (type == 1) {
    newConversation = new Conversation({ type: 1 });
  } else {
    newConversation = new Conversation({
      type: 2,
      owner: id,
      name: "New Group Chat",
    });
  }

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
    `Conversation #${
      newConversation.id
    } created between participants - ${targetIds.sort().map((p) => "#" + p)} `
  );

  res.status(201).json({ id: newConversation.id });
});

// @desc    Change a user's profile picture
// @route   POST /api/conversations/:id/avatar
// @access  Private
const changeGroupAvatar = asyncHandler(async (req: Request & {file: any}, res: Response) => {
  const {id} = req.params;
  const {id: userId } = req.session.user;
  const { file } = req;

  const {owner} = await ConversationModel.findOwner(id);
  
  if(Number(owner) != userId){
    res.status(409)
    throw new Error("User is not allowed to alter conversation")
  }

  try {
    const storedImage = await uploadImage(file, `/${id}`, {eager: "w_128,h_128,c_thumb,g_auto"});
    const avatar = (storedImage as any).secure_url;

    const updatedConversation = await  ConversationModel.updateById(id, {
      set: {
        avatar
      },
      returning: ["id", "avatar"]
    })


    if(!updatedConversation){
      res.status(400)
      throw new Error("Conversation could not be updated.")
    }

    const io = req.app.get("io");
    io.in(Number(id)).emit(socketEvents.CHANGE_CONVERSATION_AVATAR, avatar, id);

    res.status(200).json(updatedConversation);
  } catch (err) {
    res.status(500);
    throw new Error("Server error.");
  }
} 
)


// @desc    Post an image to a conversation
// @route   GET /api/conversations/:id/images
// @access  Private
const postImage = asyncHandler(
  async (req: Request & { file: any }, res: Response) => {
    const { id: conversationId } = req.params;
    const { id: userId, username } = req.session.user;
    const { file } = req;

    const conversations = await ConversationModel.findExistingConversations(
      Number(userId)
    );

    if (conversations === null) {
      res.status(404);
      throw new Error("Conversations could not be found.");
    }

    try {
      const storedImage = await uploadImage(file, `/${conversationId}`);
      const media_url = (storedImage as any).secure_url;

      const message = new Message({
        author: userId,
        conversation: Number(conversationId),
        media_url: media_url as string,
        description: "Image by " + username,
        type: 3,
      });

      await message.save();

      message.author = req.session.user;
      delete message.author.email;
      delete message.author.password;

      const io = req.app.get("io");
      io.in(Number(conversationId)).emit(socketEvents.MESSAGE, message, conversationId);
    } catch (err) {
      res.status(500);
      throw new Error("Server error.");
    }
  }
);

// @desc    Get conversations
// @route   GET /api/conversations/open
// @access  Private

const getConversations = asyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.session.user;

  const conversations = await ConversationModel.findExistingConversations(
    userId
  );

  if (conversations === null) {
    res.status(404);
    throw new Error("Conversations could not be found.");
  }

  res.status(200).json(conversations);
});

// @desc    Get a conversation
// @route   GET /api/conversations/:id
// @access  Private
const getConversation = asyncHandler(async (req: Request, res: Response) => {
  const { id: conversationId } = req.params;
  const { id: userId } = req.session.user;

  const conversation = await ConversationModel.findExistingConversation(
    Number(conversationId),
    userId
  );

  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  let userIndex;
  const userIsInConversation = conversation.participants.some(
    (participant, index) => {
      if (participant.id == userId) {
        userIndex = index;
        return true;
      }
    }
  );

  if (!userIsInConversation) {
    res.status(401);
    throw new Error("User is forbidden from conversation");
  } else {
    conversation.participants.splice(userIndex, 1);
  }

  res.status(200).json(conversation);
});

// @desc    Get messages from a conversation
// @route   GET /api/conversations/:id/messages?before=lastMessageId
// @access  Private
const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const { id: conversationId } = req.params;
  const { id: userId } = req.session.user;
  const { before: lastMessageId } = req.query;

  const conversation = await ConversationModel.findById(conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error("Conversation does not exist.");
  }

  const userIsInConversation = await ConversationParticipantModel.findAll({
    where: { conversation: conversationId, user: userId },
  });

  if (!userIsInConversation.length) {
    res.status(401);
    throw new Error("User is forbidden from conversation");
  }

  const messages = await MessageModel.getMessages(
    conversationId,
    lastMessageId as string
  );

  if (!messages) {
    res.status(404);
    throw Error();
  } else {
    res.status(200).json(messages);
  }
});

export {
  createConversation,
  getConversation,
  getConversations,
  getMessages,
  postImage,
  changeGroupAvatar
};
