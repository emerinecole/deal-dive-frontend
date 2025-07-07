import { ServerResponseError } from "./server-response-error";
import { ServerResponseMessage } from "./server-response-message";

export class NotFoundError extends Error implements ServerResponseError {
  message = ServerResponseMessage.NOT_FOUND;
  statusCode = 404;
}
