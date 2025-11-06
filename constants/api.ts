const BASE_URL = process.env.NEXT_PUBLIC_DEAL_DIVE_BACKEND_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_DEAL_DIVE_BACKEND_URL is not set");
}

export const API = {
  BASE_URL,
  DEALS: {
    LIST: "/deals",
    GET: (id: string) => `/deals/${id}`,
    CREATE: "/deals",
    UPDATE: (id: string) => `/deals/${id}`,
    DELETE: (id: string) => `/deals/${id}`,
  },
  VOTES: {
    ADD: (dealId: string) => `/deals/${dealId}/vote`,
    REMOVE: (dealId: string) => `/deals/${dealId}/vote`,
    GET: (dealId: string) => `/deals/${dealId}/votes`,
  },
  COMMENTS: {
    ADD: (dealId: string) => `/deals/${dealId}/comments`,
    LIST: (dealId: string) => `/deals/${dealId}/comments`,
    DELETE: (commentId: string) => `/comments/${commentId}`,
  },
  REPORTS: {
    ADD: (dealId: string) => `/deals/${dealId}/reports`,
    LIST: (dealId: string) => `/deals/${dealId}/reports`,
    DELETE: (reportId: string) => `/reports/${reportId}`,
  },
};
