import Model from "./Model";
import pool from "@/db/db";
import format from "pg-format";

export type MessageSchema = {
  id?: string;
  author?: string;
  conversation?: string;
  data?: string;
  parent?: string;
  is_read: boolean;
  created_at: string;
  modified_at: string;
};

export class Message extends Model<MessageSchema> {
  id?: string;
  author?: string;
  conversation?: string;
  data?: string;
  parent?: string;
  is_read: boolean;
  created_at?: string;
  modified_at?: string;

  constructor(config?: MessageSchema) {
    super("message");
    this.id = config?.id;
    this.author = config?.author;
    this.conversation = config?.conversation;
    this.data = config?.data;
    this.parent = config?.parent || null;
    this.is_read = config?.is_read || false;

  }
}

const MessageModel = new Message();

export default MessageModel;
