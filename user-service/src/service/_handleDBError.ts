import ServiceError from "../core/serviceError";

export default function handleDBError(error: any): never {
  const { code = "", message } = error;

  if (code === "P2002") {
    switch (true) {
      case message.includes("idx_user_email_unique"):
        throw ServiceError.validationFailed("A user with this email address already exists.");
      case message.includes("idx_application_name_unique"):
        throw ServiceError.validationFailed("A application with this name already exists.");
      default:
        throw ServiceError.validationFailed("This item already exists");
    }
  }

  if (code === "P2025") {
    switch (true) {
      case message.includes("user"):
        throw ServiceError.notFound("No user with this id exists");

    }
  }

  if (code === "P2014") {
    throw ServiceError.conflict(
      "This entity is related to another entity. Please delete or unlink the related entity first.",
    );
  }
  
  throw error;
};