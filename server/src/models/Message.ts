import Model from "./Model";
import pool from "@/db/db";
import format from "pg-format";

const MESSAGE_LIMIT = 50;

export type MessageSchema = {
  id?: string;
  author?: string;
  conversation?: string;
  data?: string;
  parent?: string;
  type?: number;
  media_url?: string;
  description?: string;
  created_at: string;
  modified_at: string;
};

export class Message extends Model<MessageSchema> {
  id?: string;
  author?: string;
  conversation?: string;
  data?: string;
  parent?: string;
  type?: number;
  media_url?: string;
  description?: string;
  created_at?: string;
  modified_at?: string;

  constructor(config?: MessageSchema) {
    super("message");
    this.id = config?.id;
    this.author = config?.author;
    this.conversation = config?.conversation;
    this.data = config?.data;
    this.parent = config?.parent || null;
    this.type = config?.type || 1;
    this.media_url = config?.media_url;
    this.description = config?.description;

  }

  async getMessages( conversationId: string, lastMessageId?: string) {
    const query = format(
      `SELECT         
    mesg.id, 
    mesg.author, 
    mesg.type,
    mesg.data, 
    mesg.parent, 
    mesg.media_url,
    mesg.description, 
    mesg.created_at, 
    mesg.modified_at
    FROM (SELECT *
      FROM message
      WHERE conversation = %L
      ${lastMessageId ? `AND id < %L` : ""}
      ORDER BY id DESC
      LIMIT ${MESSAGE_LIMIT}) mesg
      ORDER BY mesg.id ASC`,
      conversationId,
      lastMessageId ? lastMessageId : "",
    );

    const { rows } = await pool.query(query);
    const data: Message[] = rows.length ? rows : null;
    return data;
  }
}

const MessageModel = new Message();

export default MessageModel;
