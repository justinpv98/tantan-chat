import Model from "./Model";
import pool from "@/db/db";
import format from "pg-format";

export type ConversationParticipantSchema = {
  id?: number;
  conversation?: number;
  user?: number;
  joined_at?: string | number;
  left_at?: string | number;
  created_at?: string;
};

export class ConversationParticipant extends Model<ConversationParticipantSchema> {
  id?: number;
  conversation?: number;
  "user"?: number;
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

  async findConversationId(participants: string[]) {
    // Find conversation id of private dm through participants
    const query = format(
      `   SELECT 
      cp.conversation,
      conversation.type 
    FROM 
      conversation_participant AS cp 
    JOIN conversation 
    ON cp.conversation = conversation.id
    WHERE 
      "user" in (%L) AND conversation.type = 1
    GROUP BY 
      conversation, conversation.type
    HAVING
    count(*) = 2;
    `,
      participants
    );

    const { rows } = await pool.query(query);
    const data: string = rows.length ? rows[0].conversation : null;
    return data;
  }

}

const ConversationParticipantModel = new ConversationParticipant();

export default ConversationParticipantModel;
