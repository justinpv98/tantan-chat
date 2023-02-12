import * as dotenv from "dotenv";
import corsOptions from "./cors/corsOptions";

const env = process.env.NODE_ENV || "production";

dotenv.config();

const config = {
  client: {
    URL: process.env.CLIENT_URL,
  },
  server: {
    port: process.env.PORT,
  },
  cors: corsOptions,
};

export default config;