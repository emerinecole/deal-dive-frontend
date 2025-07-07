import { ServerResponseError } from "./server-response-error";
import { ServerResponseMessage } from "./server-response-message";

export class PreconditionFailedError extends Error implements ServerResponseError {
  message = ServerResponseMessage.PRECONDITION_FAILED;
  statusCode = 412;
} 