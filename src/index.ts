// src/worker.ts (or any path you prefer)
import worker from '../.svelte-kit/cloudflare/_worker.js';

export default {
  ...worker,

  async scheduled(
      controller: ScheduledController,
      env: Env,
      ctx: ExecutionContext
  ) {
    console.log(`Cron ${controller.cron} triggered at ${new Date().toISOString()}`);

    switch (controller.cron) {
      case "*/5 * * * *":
        await cleanupExpiredSessions(env);
        break;
      default:
        console.warn("Unknown cron pattern:", controller.cron);
    }
  }
};

async function cleanupExpiredSessions(env: Env) {
  // Your scheduled task logic here
}
