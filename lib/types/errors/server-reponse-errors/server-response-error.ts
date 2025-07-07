import { ServerResponseMessage } from "./server-response-message";

export interface ServerResponseError {
  message: ServerResponseMessage;
  statusCode: number;
}
