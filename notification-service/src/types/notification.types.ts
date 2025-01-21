export enum NotificationType {
  EMAIL = "email",
  // SMS = "sms",
  // PUSH = "push",
  // APP_TOAST = "app_toast",
  // WEB_PUSH = "web_push",
}
export enum NotificationStatus {
  SENT = "sent",
  FAILED = "failed",
  PENDING = "pending",
}
export interface CreateNotificationInput {
  type: NotificationType;
  recipient: string;
  senderId: string;
  subject: string;
  body: string;
}