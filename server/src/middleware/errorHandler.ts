import { Request, Response, NextFunction } from "express";
import logger from "@/logger/index";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Upon receiving an error and/or status code, send the error along with info as JSON.
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });

  logger.error(err)
};

export default errorHandler;