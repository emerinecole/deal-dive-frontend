import { ServerResponseError } from "./server-response-error";
import { ServerResponseMessage } from "./server-response-message";

export class InvalidTokenError extends Error implements ServerResponseError {
  message = ServerResponseMessage.INVALID_TOKEN;
  statusCode = 401;
}
