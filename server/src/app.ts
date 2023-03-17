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
import initializeSocket from "./config/sockets";
import errorHandler from "@/middleware/errorHandler";

// Routes
import authRoutes from "@/routes/authRoutes";
import userRoutes from "@/routes/userRoutes";
import conversationRoutes from "@/routes/conversationRoutes";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(config.cors));

export const sessionStore = new SessionStore(pool);
const sessionMiddleware = session({
  store: sessionStore,
  ...config.session,
} as SessionOptions);

app.use(sessionMiddleware);

// Logging
app.use(morgan("dev"));

// Scheduling
useScheduler();


// Routing
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);

// Websockets

initializeSocket(app, server, sessionMiddleware);

// Error handling middleware
app.use(errorHandler);

export default server;
