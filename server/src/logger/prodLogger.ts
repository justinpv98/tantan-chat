import { createLogger, format, transports } from "winston";
const { combine, timestamp, errors, json } = format;

function prodLogger() {
  return createLogger({
    level: "warn",
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports: [new transports.Console()],
  });
}

export default prodLogger;