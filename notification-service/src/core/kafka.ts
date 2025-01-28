import config from "config";
import { Kafka } from "kafkajs";
import { getLogger } from "./logging";

const ENV = config.get<string>("env");
const MAX_RETRIES = config.get<number>("kafka.maxRetries");
const INITIAL_DELAY = config.get<number>("kafka.initialDelay");
const KAFKA_CONFIG = config.get<{
  clientId: string
  brokers: string[]
  connectionTimeout: number
  ssl: boolean
  sasl: {
    mechanism: "plain"
    username: string
    password: string
  } 
}>("kafka.config");

// Update the KAFKA_CONFIG with the new brokers list
// Parse the brokers from the config string (if it's a comma-separated string)
const brokers = config.get<string>("kafka.config.brokers").split(",");
const kafkaConfig = {
  ...KAFKA_CONFIG,
  brokers,
};

if (kafkaConfig.sasl) {
  kafkaConfig.sasl = {
    mechanism: kafkaConfig.sasl.mechanism,
    username: kafkaConfig.sasl.username,
    password: kafkaConfig.sasl.password,
  };
}

const kafka = new Kafka(kafkaConfig);
const consumer = kafka.consumer({ groupId: `${ENV}-notification-service-group` });
let isConsumerConnected = false;

const retryWithBackoff = async (fn:() => Promise<void>, maxRetries: number, delay: number) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      const backoffDelay = delay * Math.pow(2, attempt);
      getLogger().warn(`Retry attempt ${attempt} failed. Retrying in ${backoffDelay}ms...`);
      if (attempt >= maxRetries) {
        getLogger().error("Max retries reached. Event consumption failed.", {error});
      } else await new Promise((resolve) => setTimeout(resolve, backoffDelay));  
    }  
  }  
};  

export const connectConsumer = async () => {
  try {
    getLogger().info("Connecting consumer to Kafka");
    await consumer.connect();
    isConsumerConnected = true;
    getLogger().info("Successfully connected consumer to Kafka");
  } catch (error) {
    getLogger().error("Kafka connection failed", { error });
    getLogger().warn("Kafka unavailable. Events will NOT be consumed.");
  }
};

export const consumeEvent = async (topic: string, eventHandler: (message: Record<string, any>) => Promise<void>) => {
  if (!isConsumerConnected) {
    getLogger().warn("Kafka consumer is not connected. Event will NOT be consumed.");
    return;
  }

  const consume = async () => {
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const event = JSON.parse(message.value?.toString() || "{}");
          getLogger().info(`Received event on topic ${topic}:${partition}:`, event);
          await eventHandler(event);
          getLogger().info(`Event successfully consumed (topic: '${topic}')`);
        } catch (error) {
          getLogger().error(`Error processing message from topic ${topic}`, { error });
        }
      },
    });
  };

  try {
    await retryWithBackoff(consume, MAX_RETRIES, INITIAL_DELAY);
  } catch (error) {
    getLogger().error("Error consuming event after retries", { error });
  }
};

export const disconnectConsumer = async () => {
  getLogger().info("Disconnecting Kafka consumer");

  if (!isConsumerConnected) {
    getLogger().warn("Kafka consumer is already disconnected.");
    return;
  }

  await consumer.disconnect();
  getLogger().info("Successfully disconnected Kafka consumer");
};
