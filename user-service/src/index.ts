import { getLogger } from "./core/logging";
import { initializeData, shutdownData } from "./data";
import { createServer } from "./server";

async function main() {
  try {
    await initializeData();
    const server = await createServer();
    await server.start();
      
    async function onClose() {
      await shutdownData();
      getLogger().info("Goodbye! 👋");
      process.exit(0);
    }
  
    process.on("SIGTERM", onClose);
    process.on("SIGQUIT", onClose);
  } catch (error) {
    console.log("\n", error);
    process.exit(-1);
  }
}
  
main();
  
// TODO: useraccount creation /useraccount not /users
// TODO: useraccount deletion deletes account
// TODO: what happens in other services when an user account gets deleted?
// TODO: send mail upon account creation
// TODO: On event kafka bus
// TODO: update user schema in docs