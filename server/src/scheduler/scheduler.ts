import cron from "node-cron";
import SessionModel from "@/models/Session";
import NotificationModel from "@/models/Notification";
import logger from "@/logger";

function useScheduler() {
  // Session Clearing Job - everyday at 2AM PST
  cron.schedule(
    "0 2 * * *",
    () => {
      SessionModel.deleteAll({ where: { expire: { lte: "now()" } } });
      logger.info("Expired sessions have been deleted.");
    },
    {
      scheduled: true,
      timezone: "America/Los_Angeles",
    }
  );

  cron.schedule(
    "0 1 * * *",
    () => {
      NotificationModel.deleteAll({
        where: {
          created_at: { lte: "now() - INTERVAL '5 days'" },
          type: { nte: 1 },
        },
      });
      logger.info("Expired notifications have been deleted.");
    },
    {
      scheduled: true,
      timezone: "America/Los_Angeles",
    }
  );
}

export default useScheduler;
