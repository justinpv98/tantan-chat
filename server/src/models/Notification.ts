import Model from "./Model";

export type NotificationSchema = {
  id?: number;
  type?: number;
  actor?: number;
  target?: number;
  read?: boolean;
};

export class Notification extends Model<NotificationSchema> {
  id?: number;
  type?: number;
  actor?: number;
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
}

const NotificationModel = new Notification();

export default NotificationModel;
