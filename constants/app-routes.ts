export const APP_ROUTES = {
  HOME: "/",
  ACCOUNT: "/account",
  CREATE: "/create",
  HOT: "/hot",
  SAVED: "/saved",
  SEARCH_PAGE: "/search",
  AUTH: {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    CALLBACK: "/auth/callback",
  },
  ONBOARDING: {
    PROJECT: "/onboarding/project",
  },
  INSTALL: "/install",
  PROJECTS: "/projects",
  USERS: "/users",
  SESSION: {
    LIST: "/sessions",
    DETAIL: (id: string) => `/sessions/${id}`,
  },
  COLLECTIONS: {
    LIST: "/collections",
    DETAIL: (id: string) => `${APP_ROUTES.COLLECTIONS.LIST}/${id}`,
  },
  ISSUES: {
    LIST: "/issues",
    DETAIL: (id: string) => `${APP_ROUTES.ISSUES.LIST}/${id}`,
  },
  SEARCH: (query: string, filters: string) =>
    `/search?query=${query}&${filters}`,
  GOLDEN_PATH: "/golden-path",
  GOLDEN_PATH_DETAIL: (id: string) => `/golden-path/${id}`,
};
