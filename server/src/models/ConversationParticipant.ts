import Model from "./Model";

export type ConversationParticipantSchema = {
  id?: string;
  conversation?: string;
  user?: string;
  joined_at?: string | number;
  left_at?: string | number;
  created_at?: string;
};

export class ConversationParticipant extends Model<ConversationParticipantSchema> {
  id?: string;
  conversation?: string;
  "user"?: string;
  joined_at?: string | number;
  left_at?: string | number;
  created_at?: string;

  constructor(config?: ConversationParticipantSchema) {
    super("conversation_participant");
    this.id = config?.id;
    this.conversation = config?.conversation;
    this.user = config?.user;
    this.joined_at = config?.joined_at;
    this.left_at = config?.left_at;
    this.created_at = config?.created_at;
  }
}

const ConversationParticipantModel = new ConversationParticipant();

export default ConversationParticipantModel;
