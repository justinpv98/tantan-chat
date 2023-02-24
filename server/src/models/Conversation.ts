import Model from "./Model";
import pool from "@/db/db";
import format from "pg-format";

import { ConversationParticipantSchema as Participant } from "./ConversationParticipant";
import { MessageSchema as Message } from "./Message";

export type ConversationSchema = {
  id?: string;
  type?: string;
  owner?: string;
  name?: string;
};

type FoundConversationSchema = {
  id: string;
  name: string | null;
  type: "dm" | "group chat";
  participants: Participant[];
  messages: Message[];
};

export class Conversation extends Model<ConversationSchema> {
  id?: string;
  type: string;
  owner?: string;
  name?: string;

  constructor(config?: ConversationSchema) {
    super("conversation");
    this.id = config?.id;
    this.type = config?.type || "1";
    this.owner = config?.owner;
    this.name = config?.name;
  }

  async findIdByParticipants(participants: string[]) {
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

  async findExistingConversation(conversationId: string) {
    // Get existing conversation with messages and participants in one query using
    // Postgres's native json formatting
    const query = format(
      `SELECT 
      to_json(convo) 
    FROM 
      (
        SELECT 
          c.id, 
          c.name, 
          c.owner, 
          (
            SELECT 
              type 
            FROM 
              conversation_type ct 
            WHERE 
              c.type = ct.id
          ), 
          (
            SELECT 
              json_agg(participant) 
            FROM 
              (
                SELECT 
                  "user".id, 
                  "user".username, 
                  "user".profile_picture 
                FROM 
                  (
                    SELECT 
                      * 
                    FROM 
                      conversation_participant 
                    WHERE 
                      conversation_participant.conversation = c.id
                  ) cp 
                  LEFT JOIN "user" ON "user".id = cp."user"
              ) participant
          ) AS participants, 
          (
            SELECT 
              json_agg(message) 
            FROM 
              (
                SELECT 
                  message.id, 
                  message.author, 
                  message.data, 
                  message.parent, 
                  message.is_read, 
                  message.created_at, 
                  message.modified_at, 
                  (
                    SELECT 
                      json_agg(attachment) 
                    FROM 
                      attachment 
                    WHERE 
                      attachment.message = message.id 
                  ) as attachments 
                FROM 
                  message 
                WHERE 
                  message.conversation = c.id
              ) message
          ) AS messages 
        FROM 
          conversation c 
        WHERE 
          c.id = %L
      ) convo
     `,
      conversationId
    );

    const { rows } = await pool.query(query);
    const data: FoundConversationSchema = rows.length ? rows[0].to_json : null;
    return data;
  }
}

const ConversationModel = new Conversation();

export default ConversationModel;
