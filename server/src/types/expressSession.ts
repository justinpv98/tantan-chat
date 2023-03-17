import { UserSchema } from "@/models/User";

declare module "express-session" {
    interface SessionData {
      user?: UserSchema
    }


  }
  
  export default "express-session";