const BASE_URL = process.env.NEXT_PUBLIC_DEAL_DIVE_BACKEND_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_DEAL_DIVE_BACKEND_URL is not set");
}

export const API = {
  BASE_URL,
  USER: {
    LIST: "/user/list",
    SIGNUP: "/user/signup",
    ROLES: "/user/roles",
    INVITE: "/user/invite",
  }
} as const;
