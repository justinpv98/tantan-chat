import * as dotenv from "dotenv";
import corsOptions from "./cors/corsOptions";

const env = process.env.NODE_ENV || "dev";


dotenv.config();

const config = {
  client: {
    URL: process.env.CLIENT_URL,
  },
  server: {
    port: process.env.PORT,
  },
  argon2: {
    memoryCost: 2 ** 16, // 64 MB
    hashLength: 32 // should be longer in a prod environment
  },
  cors: corsOptions,
  session: {
    credentials: true,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env !== "dev",
      httpOnly: env !== "dev",
      sameSite: false,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  },
};

export default config;