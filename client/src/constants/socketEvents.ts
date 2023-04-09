enum socketEvents {
  CHANGE_CONVERSATION_NAME = "changeConversationName",
  CHANGE_CONVERSATION_AVATAR = "changeConversationAvatar",
  CREATE_CONVERSATION = "createConversation",
  CREATE_GROUP_DM = "createGroupDM",
  CREATE_RELATIONSHIP = "createRelationship",
  MESSAGE = "message",
  READ_MESSAGES = "readMessages",
  REMOVE_RELATIONSHIP = "removeRelationship",
  SEND_NOTIFICATION = "sendNotification",
  SET_STATUS = "setStatus",
  TYPING = "typing",
  UPDATE_RELATIONSHIP = "updateRelationship",
}

export default socketEvents;
