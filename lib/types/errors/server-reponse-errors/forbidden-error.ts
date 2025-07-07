import { ServerResponseError } from "./server-response-error";
import { ServerResponseMessage } from "./server-response-message";

export class ForbiddenError extends Error implements ServerResponseError {
  message = ServerResponseMessage.FORBIDDEN;
  statusCode = 403;
}
