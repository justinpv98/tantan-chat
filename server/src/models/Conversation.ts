import Model from "./Model";
import pool from "@/db/db";
import format from "pg-format";

import { ConversationParticipantSchema as Participant } from "./ConversationParticipant";
import { MessageSchema as Message, MessageSchema } from "./Message";
import { array } from "zod";

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
  last_message: Message[] | null;
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

  async findExistingConversation(conversationId: string) {
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
                "user".profile_picture,
                "user".status
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
        ( SELECT json_build_object('id', message.id, 'data', message.data, 'media_url', message.media_url, 'description', message.description, 'type', message.type, 'created_at', message.created_at) FROM message
        WHERE
            message.id = (
                SELECT
                    max(message.id)
            FROM message
        WHERE
            message.conversation = c.id)) AS last_message
      FROM 
        conversation c 
      WHERE 
        c.id = %L) convo `,
      conversationId
    );

    const { rows } = await pool.query(query);
    const data: FoundConversationSchema = rows.length ? rows[0].to_json : null;

    return data;
  }

  async findExistingConversations(userId: string) {
    // Get existing conversation with messages and participants in one query using
    // Postgres's native json formatting
    const query = format(
      `SELECT
      json_build_object('id', c.id, 'name', c.name, 'type', c.type, 'participants', (
              SELECT
                  json_agg(p)
              FROM (
                  SELECT
                      u.id, u.username, u.profile_picture, u.status
                  FROM "user" u
                  LEFT JOIN conversation_participant cp ON cp."user" = u.id
                  WHERE
                      u.id != %L
                      AND cp.conversation = c.id GROUP BY u.id) AS p), 'last_message', ( SELECT json_build_object('id', message.id, 'data', message.data, 'media_url', message.media_url, 'description', message.description, 'type', message.type, 'created_at', message.created_at) FROM message
                      WHERE
                          message.id = (
                              SELECT
                                  max(message.id)
                          FROM message
                      WHERE
                          message.conversation = c.id)))
  FROM
      conversation_participant cp
      LEFT JOIN conversation AS c ON cp.conversation = c.id
      INNER JOIN message AS m on c.id = m.conversation
  WHERE
      cp."user" = %L
  GROUP BY
      c.id
    
     `,
      userId,
      userId
    );

    const { rows } = await pool.query(query);
    let data: FoundConversationSchema[] = [];
    if (rows.length) {
      data = rows
        .map((row) => row.json_build_object)
        .sort((a: any, b: any) => {
          return a.last_message.id < b.last_message.id ? 1 : -1;
        });
    } else {
      data = null;
    }
    return data;
  }
}

const ConversationModel = new Conversation();

export default ConversationModel;
