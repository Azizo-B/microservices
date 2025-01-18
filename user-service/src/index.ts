import { connectProducer, disconnectProducer } from "./core/kafka";
import { getLogger } from "./core/logging";
import { initializeData, shutdownData } from "./data";
import { createServer } from "./server";

async function main() {
  try {
    await connectProducer();
    await initializeData();
    const server = await createServer();
    await server.start();
      
    async function onClose() {
      await disconnectProducer();
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