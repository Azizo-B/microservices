import config from "config";
import { Kafka } from "kafkajs";
import { getLogger } from "./logging";

const MAX_RETRIES = config.get<number>("kafka.maxRetries");
const INITIAL_DELAY = config.get<number>("kafka.initialDelay");
const KAFKA_CONFIG = config.get<{
  clientId: string
  brokers: string[]
  connectionTimeout: number
  ssl?: boolean
  sasl?: {
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
const producer = kafka.producer();
let isProducerConnected = false;

const retryWithBackoff = async (fn:() => Promise<void>, maxRetries: number, delay: number) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      const backoffDelay = delay * Math.pow(2, attempt);
      getLogger().warn(
        `Retry attempt ${attempt} failed because of '${error.message}'. Retrying in ${backoffDelay}ms...`,
      );
      if (attempt >= maxRetries) {
        getLogger().error("Max retries reached. Event publishing failed.", {error});
      } else await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }
};
  
export const connectProducer = async () => {
  try{
    getLogger().info("Connecting producer to Kafka");
    await producer.connect();
    isProducerConnected = true;
    getLogger().info("Successfully connected producer to kafka");
  } catch (error) {
    getLogger().error("Kafka connection failed", {error});
    getLogger().warn("Kafka unavailable. Events will NOT be published.");
  }
};

export const publishEvent = async (topic: string, message: Record<string, any>) => {
  if (!isProducerConnected) {
    getLogger().warn("Kafka producer is not connected. Event will NOT be published.");
    return;
  }

  const publish = async () => {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    getLogger().info(`Event successfully published to topic: ${topic}`);
  };
  
  try {
    await retryWithBackoff(publish, MAX_RETRIES, INITIAL_DELAY);
  } catch (error) {
    getLogger().error("Error publishing event after retries", {error});
  }
};

export const disconnectProducer = async () => {
  getLogger().info("Disconnecting kafka producer");
  
  if (!isProducerConnected) {
    getLogger().warn("Kafka producer is already disconnected.");
    return;
  }
  await producer.disconnect();
  getLogger().info("Successfully disconnected kafka producer");
};
