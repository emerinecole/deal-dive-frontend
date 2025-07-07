const BASE_URL = process.env.NEXT_PUBLIC_ATLAS_BACKEND_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_ATLAS_BACKEND_URL is not set");
}

export const API = {
  BASE_URL,
  INDUSTRY: {
    LIST: "/industry/",
  },
  USER: {
    LIST: "/user/list",
    SIGNUP: "/user/signup",
    ROLES: "/user/roles",
    INVITE: "/user/invite",
  },
  PROJECT: {
    LIST: "/product",
    GET: (id: string) => `/product/${id}`,
    UPDATE: (id: string) => `/product/${id}`,
    DELETE: (id: string) => `/product/${id}`,
  },
  DISCOVERY_PROJECT: {
    LIST: (productId: string) =>
      `/discovery_project/products/${productId}/projects`,
    GET: (product_id: string) =>
      `/discovery_project/products/${product_id}/projects`,
  },
  GOLDEN_PATH: {
    LIST: (productId: string) => `/products/${productId}/golden-paths`,
    CREATE: (productId: string) => `/products/${productId}/golden-paths`,
    GET: (projectId: string, pathId: string) => `/products/${projectId}/golden-paths/${pathId}`,
    UPDATE: (productId: string, pathId: string) => `/products/${productId}/golden-paths/${pathId}`,
    DELETE: (productId: string, pathId: string) => `/products/${productId}/golden-paths/${pathId}`,
    GET_SESSIONS: (productId: string, pathId: string) => `/products/${productId}/golden-paths/${pathId}/sessions`,
  },
  PROJECT_INTEGRATION_STATUS: (id: string) =>
    `/product/${id}/integration/status`,
  SESSION: {
    LIST: "/session",
    GET: (id: string) => `/session/${id}`,
    IFRAME: (id: string) => `/session/${id}/iframe`,
    SEARCH: (id: string) => `/session/semantic/search/${id}`,
    SEARCH_ACROSS_SESSIONS: "/session/across/search",
    CHAT_BOT: "/session/chatbot/query",
    HISTORY: "/session/search-queries/history",
    MARK_SESSION: (session_id: string) =>
      `/session/sessions/${session_id}/done`,
    EMAILS: '/session/emails',
    LIST_BY_ID: () => "/session/sessions/batch",
  },
  RECOMMENDED: {
    WEEKLY: (projectId: string) => `/recommendation/weekly/${projectId}`,
    MARK_DONE: (recommendationId: string) =>
      `/recommendation/mark-done/${recommendationId}/`,
  },
  COLLECTION: {
    LIST: "/collection",
    GET: (id: string) => `/collection/${id}`,
    DELETE: (id: string) => `/collection/${id}`,
    UPDATE: (id: string) => `/collection/${id}`,
    FROM_SESSION: (sessionId: string) => `/collection/session/${sessionId}`,
    ADD_SESSION: ({
      collectionId,
      sessionId,
    }: {
      collectionId: string;
      sessionId: string | string[];
    }) => `/collection/${collectionId}/session/${sessionId}`,
    ADD_BULK_SESSIONS: ({ collection_id }: { collection_id: string }) =>
      `/collection/${collection_id}/sessions/bulk-add`,
    REMOVE_SESSION: ({
      collectionId,
      sessionId,
    }: {
      collectionId: string;
      sessionId: string;
    }) => `/collection/${collectionId}/session/${sessionId}`,
  },
  COLLECTION_SUMMARY: {
    LIST: "/collection_summary_run",
  },
  ISSUES: {
    LIST: (product_id: string, period: string, discovery_project_id?: string) =>
      `/products/${product_id}/issues?period=${period}${
        discovery_project_id
          ? `&discovery_project_id=${discovery_project_id}`
          : ""
      }`,
    ADD_SESSION: ({
      product_id,
      org_id,
    }: {
      product_id: string;
      org_id: string;
    }) => `/products/${product_id}/issues/recommended?org_id=${org_id}`,
    GET: ({ product_id, issue_id }: { product_id: string; issue_id: string }) =>
      `/products/${product_id}/issues/${issue_id}`,
    GET_ISSUE_COLLECTIONS: ({
      product_id,
      issue_id,
      project_id,
    }: {
      product_id: string;
      issue_id: string;
      project_id: string;
    }) =>
      `/products/${product_id}/issues/${issue_id}/collections?project_id=${project_id}`,
    GET_ISSUE_SESSIONS: ({
      product_id,
      issue_id,
    }: {
      product_id: string;
      issue_id: string;
    }) => `/products/${product_id}/issues/${issue_id}/sessions`,
  },
  EVALUATION: {
    SUMMARY_UPLOAD: (id: string) => `/sessions/${id}/summary/upload-url`,
    SUMMARY_UPLOAD_CONFIRMATION: (id: string) =>
      `/sessions/${id}/summary/complete`,
  },
  POSTHOG: {
    POSTHOG_CONNECT_STATUS: (product_id: string) =>
      `/integrations/posthog/products/${product_id}`,
  },
  FEEDBACK: {
    SESSION_RATE: (session_id: string) => `/session/sessions/${session_id}/rate`,
    SEARCH_RATE: (search_query_id: string) => `/search/search-queries/${search_query_id}/rate`,
  },
} as const;
