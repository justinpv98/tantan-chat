import config from "@/config/config";
import argon2 from "argon2";

import Model from "./Model";

export type UserSchema = {
  id?: number;
  email?: string;
  username?: string;
  password?: string;
  profile_picture?: string | null;
  status?: 1 | 2 | 3 | 4;
};

export class User extends Model<UserSchema> {
  id?: number;
  email?: string;
  username?: string;
  password?: string;
  profile_picture?: string | null;
  status?: 1 | 2 | 3 | 4;

  constructor(config?: UserSchema) {
    super("user");
    this.id = config?.id;
    this.email = config?.email;
    this.username = config?.username;
    this.password = config?.password;
    this.profile_picture = config?.profile_picture;
    this.status = config?.status;
  }

  static async hashPassword(password: string) {
    const hash = await argon2.hash(password, config.argon2);

    return hash;
  }

  static async verifyPassword(hash: string, password: string) {
    const isValid = await argon2.verify(hash, password);
    return isValid;
  }
}

const UserModel = new User();

export default UserModel;
