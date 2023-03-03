import Model from "./Model";
import pool from "@/db/db";
import format from "pg-format";

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

  async findConversationId(participants: string[]) {
    // Find conversation id through participants
    const query = format(
      `   SELECT 
      cp.conversation 
    FROM 
      conversation_participant AS cp 
    WHERE 
      "user" in (%L) 
    GROUP BY 
      conversation 
    HAVING 
      count(*) = %L
    `,
      participants,
      participants.length
    );

    const { rows } = await pool.query(query);
    const data: string = rows.length ? rows[0].conversation : null;
    return data;
  }

}

const ConversationParticipantModel = new ConversationParticipant();

export default ConversationParticipantModel;
