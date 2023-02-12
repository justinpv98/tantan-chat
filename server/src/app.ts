import http from "http";
import express from "express";
import config from "@/config/config";

// Middleware
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "@/middleware/errorHandler";

const app = express();
const server = http.createServer(app);

/* Setup Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(config.cors));

/* Logging */
app.use(morgan("dev"));

/* Error handling */
app.use(errorHandler);

export default server;
