import { apiErrorSchema, apiStatusError } from "./schemas/api-error-schema";
import { NotFoundError } from "./types/errors/server-reponse-errors/not-found-errors";
import { PreconditionFailedError } from "./types/errors/server-reponse-errors/precondition-failed-error";
import { ForbiddenError } from "./types/errors/server-reponse-errors/forbidden-error";
import { UnauthorizedError } from "./types/errors/server-reponse-errors/unauthorized-error";
import { InvalidTokenError } from "./types/errors/server-reponse-errors/invalid-token-error";
import { createClient } from "./supabase/client";

/**
 * APIClient handles HTTP requests to the backend API.
 * Only use this client for server side requests.
 */
class APIClient {
  private baseURL: string;
  private authenticated: boolean;
  constructor(baseURL: string, authenticated = true) {
    this.baseURL = baseURL;
    this.authenticated = authenticated;
  }

  private async getHeaders(): Promise<HeadersInit> {
    if (!this.authenticated) {
      return {
        "Content-Type": "application/json",
      };
    }

    // If it's called from server side, throw an error
    if (typeof window === "undefined") {
      throw new Error("Not implemented");
    }

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        return {
          "Content-Type": "application/json",
        };
      }

      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      };
    } catch {
      throw new InvalidTokenError();
    }
  }

  async get(endpoint: string, params?: URLSearchParams): Promise<Response> {
    const headers = await this.getHeaders();
    const url = `${this.baseURL}${endpoint}${
      params ? `?${params.toString()}` : ""
    }`;
    const response = await fetch(url, {
      headers,
      method: "GET",
    });

    return this.handleResponse(response);
  }


  async post(endpoint: string, data?: unknown): Promise<Response> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse(response);
  }

  async postStream(
    endpoint: string,
    data?: unknown
  ): Promise<ReadableStream<Uint8Array<ArrayBufferLike>>> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.body) {
      throw new Error("ReadableStream not supported");
    }

    return response.body;
  }

  async put(endpoint: string, data?: unknown): Promise<Response> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse(response);
  }

  async delete(endpoint: string, params?: URLSearchParams): Promise<void> {
    const headers = await this.getHeaders();
    const url = `${this.baseURL}${endpoint}${
      params ? `?${params.toString()}` : ""
    }`;
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (response.status !== 204) {
      this.handleResponse(response);
      return;
    }
  }

  private async handleResponse(response: Response): Promise<Response> {
    const responseJson = await response.json();

    if (!response.ok) {
      throw this.handleError(responseJson);
    }
    if (responseJson.error) {
      throw this.handleError(responseJson.error);
    }

    if (responseJson.data) {
      return responseJson.data;
    }

    return responseJson;
  }


  // TODO: Create a better error handling
  private handleError(error: unknown): Error {
    const statusError = apiStatusError.safeParse(error);
    if (statusError.success) {
      const { statusCode } = statusError.data;
      if (statusCode === 403) {
        return new ForbiddenError();
      }
      if (statusCode === 401) {
        return new UnauthorizedError();
      }
      if (statusCode === 404) {
        return new NotFoundError();
      }
      if (statusCode === 412) {
        return new PreconditionFailedError();
      }
      if (statusError.data.message) {
        return new Error(statusError.data.message);
      }
    }

    const parsedError = apiErrorSchema.safeParse(error);
    if (parsedError.success) {
      return new Error(parsedError.data.detail[0].msg);
    }

    if (error instanceof Error) {
      return error;
    }

    return new Error(JSON.stringify(error));
  }
}

export const apiClient = new APIClient(
  process.env.NEXT_PUBLIC_DEAL_DIVE_BACKEND_URL!
);

export const unauthenticatedApiClient = new APIClient(
  process.env.NEXT_PUBLIC_DEAL_DIVE_BACKEND_URL!,
  false
);
