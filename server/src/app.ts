import http from "http";
import express from "express";
import config from "@/config/config";
import pool from "@/db/db";

// Middleware
import helmet from "helmet";
import cors from "cors";
import session, { SessionOptions } from "express-session";
import sessionMerge from "./types/expressSession";
const SessionStore = require("connect-pg-simple")(session);
import morgan from "morgan";
import useScheduler from "./scheduler/scheduler";
import errorHandler from "@/middleware/errorHandler";

// Routes
import authRoutes from "@/routes/authRoutes";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(config.cors));

app.use(
  session({
    store: new SessionStore(pool),
    ...config.session,
  } as SessionOptions)
);

// Logging
app.use(morgan("dev"));

// Scheduling
useScheduler();

// Routing
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use(errorHandler);

export default server;