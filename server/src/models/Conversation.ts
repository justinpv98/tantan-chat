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
  lastMessageId: string;
  messages: Message[];
  totalPages: number;
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

  async findAllByParticipant(userId: string) {
    // Find all conversations for a user
    const query = format(
      ` SELECT conversation AS conversation_id
    FROM conversation_participant AS cp
    WHERE cp.user = %L`,
      userId
    );

    const { rows } = await pool.query(query);
    const data: { conversation_id: string }[] = rows.length ? rows : null;
    return data;
  }

  async findExistingConversation(conversationId: string, messageLimit: number) {
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
          c.type,
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
                  mesg.id, 
                  mesg.author, 
                  mesg.data, 
                  mesg.parent, 
                  mesg.is_read, 
                  mesg.created_at, 
                  mesg.modified_at, 
                  (
                    SELECT 
                      json_agg(attachment) 
                    FROM 
                      attachment 
                    WHERE 
                      attachment.message = mesg.id 
                  ) as attachments 
                FROM 
                  (SELECT * 
                    FROM message
                    WHERE 
                    message.conversation = c.id
                    ORDER BY id DESC
                    LIMIT %L
                    ) mesg
                ORDER BY mesg.id ASC
              ) message
          ) AS messages 
        FROM 
          conversation c 
        WHERE 
          c.id = %L
      ) convo
     `,
      messageLimit,
      conversationId
    );

    const { rows } = await pool.query(query);
    const data: FoundConversationSchema = rows.length ? rows[0].to_json : null;
    return data;
  }
}

const ConversationModel = new Conversation();

export default ConversationModel;
