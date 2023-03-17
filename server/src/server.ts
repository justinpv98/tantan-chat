import server from "./app";
import config from "@/config/config";
import logger from "./logger";

const port = config.server.port;

server.listen(port, () => {
   logger.info(`Application is listening on port ${port}.`);
});