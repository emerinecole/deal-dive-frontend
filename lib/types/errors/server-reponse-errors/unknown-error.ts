import { ServerResponseError } from "./server-response-error";
import { ServerResponseMessage } from "./server-response-message";

export class UnknownError extends Error implements ServerResponseError {
  message = ServerResponseMessage.UNKNOWN;
  statusCode = 500;
}
