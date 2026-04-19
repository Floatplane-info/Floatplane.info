export async function scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
) {
  console.log(`Cron ${controller.cron} triggered`);

  switch (controller.cron) {
    case "*/5 * * * *":
      console.log("Running cleanupExpiredSessions");
      break;
    default:
      console.warn("Unknown cron pattern:", controller.cron);
  }
}
