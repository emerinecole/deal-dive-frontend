import { ServerResponseError } from "./server-response-error";
import { ServerResponseMessage } from "./server-response-message";

export class UnauthorizedError extends Error implements ServerResponseError {
  message = ServerResponseMessage.UNAUTHORIZED;
  statusCode = 401;
}
