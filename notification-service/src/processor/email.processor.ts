import { Notification } from "@prisma/client";
import nodemailer from "nodemailer";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { NotificationStatus } from "../types/notification.types";
import { EmailCredentials } from "../types/sender.types";

export async function emailProcessor(
  notification: Notification,
  credentials: EmailCredentials,
): Promise<Notification> {
  const { smtpHost, smtpPort, email, password } = credentials;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // Use SSL for port 465
    auth: {
      user: email,
      pass: password,
    },
  });

  try {
    await transporter.verify();
  } catch {
    throw ServiceError.validationFailed(
      "Failed to connect to the SMTP server. Please verify the credentials and server configuration.",
    );
  }

  try {
    const mailOptions = {
      from: email,
      to: notification.recipient,
      subject: notification.subject || "",
      text: notification.body || "",
    // TODO: html support  html: `<p>${notification.body || ""}</p>`, 
    };

    await transporter.sendMail(mailOptions);

    notification = await prisma.notification.update({
      where: { id: notification.id },
      data: { status: NotificationStatus.SENT, sentAt: new Date()},
    });
    return notification;
  } catch{
    await prisma.notification.update({
      where: { id: notification.id },
      data: { status: NotificationStatus.FAILED },
    });
    throw ServiceError.internalServerError("Failed to send email notification.");
  }
}