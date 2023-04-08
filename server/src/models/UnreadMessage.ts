import pool from "@/db/db";
import format from "pg-format";
import Model from "./Model";

export type UnreadMessageSchema = {
  id?: number;
  reader?: number;
  message?: number;
  conversation?: number;
};

export class UnreadMessage extends Model<UnreadMessageSchema> {
  id?: number;
  reader?: number;
  message?: number;
  conversation?: number;

  constructor(config?: UnreadMessageSchema) {
    super("unread_message");
    this.id = config?.id;
    this.reader = config?.reader;
    this.message = config?.message;
    this.conversation = config?.conversation;
  }

  async addUnreadMessage(
    authorId: number,
    messageId: number,
    conversationId: number
  ) {
    console.log(authorId, messageId, conversationId)
    const query = format(
      `INSERT INTO unread_message (reader, message, conversation)
    SELECT conversation_participant."user", %L, %L
    FROM conversation_participant
    WHERE conversation_participant.conversation = %L AND conversation_participant."user" != %L
    `,
      messageId,
      conversationId,
      conversationId,
      authorId
    );

    const { rows } = await pool.query(query);
    const data: UnreadMessageSchema = rows.length ? rows[0] : null;
    return data;
  }
}

const UnreadMessageModel = new UnreadMessage();

export default UnreadMessageModel;
