import axios from "axios";
import config from "config";
import { getAuthToken } from "../core/auth";
import { getLogger } from "../core/logging";
import ServiceError from "../core/serviceError";
import * as notificationService from "../service/notification.service";
import { NotificationType } from "../types/notification.types";

const USER_SERVICE_BASE_URL = config.get<string>("userService.baseUrl");
export async function handleUserCreatedEvent(event: any): Promise<void>{
  const { userId } = event;

  try{
    const token = await getAuthToken();
    const response = await axios.get(`${USER_SERVICE_BASE_URL}/api/users/${userId}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    const { email, appId } = response.data;
  
    await notificationService.createNotification(userId, {
      type: NotificationType.EMAIL,
      recipient: email,
      senderId: appId, // how to get valid sender based on app
      subject: "temp subject: user created",
      body: "temp body: user created",

    });
  }catch (error: any){
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Unknown error occurred";
      getLogger().error(`Error fetching user data for userId ${userId}: ${message}`, { status, error });
      throw new ServiceError(status.toString(), message);
    } else {
      getLogger().error("Error processing user created event", { error });
    }
  }

}
