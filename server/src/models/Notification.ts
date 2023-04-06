import Model from "./Model";
import pool from "@/db/db";
import format from "pg-format";

import { UserSchema } from "./User";

export type NotificationSchema = {
  id?: number;
  type?: number;
  actor?: number | UserSchema;
  target?: number;
  read?: boolean;
};

export class Notification extends Model<NotificationSchema> {
  id?: number;
  type?: number;
  actor?: number | UserSchema;
  target?: number;
  read?: boolean;

  constructor(config?: NotificationSchema) {
    super("notification");
    this.id = config?.id;
    this.type = config?.type;
    this.actor = config?.actor;
    this.target = config?.target;
    this.read = config?.read;
  }

 async getNotifications(targetId: number) {
    const query = format(
      `SELECT id, type, target, 
      (SELECT row_to_json("user")::jsonb-'password'-'email' 
      FROM "user" 
      WHERE "user".id = notification.actor) AS actor
       FROM notification
       WHERE notification.target = %L`,
      targetId
    );

    const { rows } = await pool.query(query);
    const data: NotificationSchema[] = rows.length ? rows : null;
    return data;
  }
}

const NotificationModel = new Notification();

export default NotificationModel;
