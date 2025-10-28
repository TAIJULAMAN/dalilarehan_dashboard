import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { handleError } from "../../Toast";

const getApiBaseUrl = () => {
  const envBase = (import.meta?.env?.VITE_API_URL || "").toString().trim();
  if (envBase) return envBase.replace(/\/+$/, "");
  if (typeof window !== "undefined") {
    const guess = (
      window.__API_BASE__ || `${window.location.origin}/api/v1`
    ).toString();
    return guess.replace(/\/+$/, "");
  }
  // Node/SSR fallback: relative path so host can proxy /api/v1
  return "/api/v1";
};

// Recursively walk JSON and prefix relative media paths with API base URL
const normalizeMediaUrls = (input) => {
  const prefixIfMediaPath = (val) => {
    if (typeof val !== "string") return val;
    if (/^https?:\/\//i.test(val)) return val; // already absolute
    const base = getApiBaseUrl().replace(/\/$/, "");
    // Match common media folder roots starting with a single leading slash
    if (/^\/(images?|uploads?|avatars?|videos?|media)\//i.test(val)) {
      return `${base}${val}`;
    }
    // Also handle paths without the leading slash e.g., "images/..."
    if (/^(images?|uploads?|avatars?|videos?|media)\//i.test(val)) {
      return `${base}/${val}`;
    }
    return val;
  };

  const walk = (node) => {
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) node[i] = walk(node[i]);
      return node;
    }
    if (node && typeof node === "object") {
      for (const k of Object.keys(node)) node[k] = walk(node[k]);
      return node;
    }
    return prefixIfMediaPath(node);
  };

  try {
    return walk(input);
  } catch (_) {
    return input;
  }
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  prepareHeaders: (headers) => {
    const getCookie = (name) => {
      if (typeof document === "undefined") return null;
      const match = document.cookie.match(
        new RegExp(
          "(?:^|; )" +
            name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") +
            "=([^;]*)"
        )
      );
      return match ? decodeURIComponent(match[1]) : null;
    };
    const cookieToken = getCookie("accessToken") || getCookie("token");
    const lsToken =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("accessToken") || localStorage.getItem("token")
        : null;
    const token = cookieToken || lsToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    // Allow any response type (JSON, binary blobs like XLS, CSV, etc.).
    // Individual endpoints can still parse/transform as needed. Using '*/*'
    // prevents the server from forcing JSON-only responses for exports.
    headers.set("Accept", "*/*");
    return headers;
  },
  responseHandler: async (response) => {
    const contentType = response.headers.get("content-type") || "";
    // JSON responses: parse and normalize media URLs
    if (contentType.includes("application/json")) {
      const json = await response.json();
      return normalizeMediaUrls(json);
    }

    // Binary files (Excel, generic octet-stream, PDFs, etc.) should be
    // returned as Blobs so callers can download them directly. Match a
    // handful of common binary content-types. If the server returns
    // CSV/text, we'll still handle it as text below.
    const binaryTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/octet-stream",
      "application/pdf",
      "application/vnd",
      "binary/octet-stream",
    ];

    if (binaryTypes.some((t) => contentType.includes(t))) {
      return await response.blob();
    }

    // Fallback: if server returned text (CSV, HTML error pages, etc.),
    // return as text so callers can inspect and show friendly messages.
    return await response.text();
  },
});

const baseQueryWithAutoLogout = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  // If server returned an HTML/text error mentioning permission denied, show a toast.
  try {
    const textData =
      typeof result?.data === "string"
        ? result.data
        : typeof result?.error?.data === "string"
        ? result.error.data
        : null;
    if (textData) {
      // crude check for permission denied messages coming as HTML error pages
      if (
        /permission denied/i.test(textData) ||
        /One of \[.*\] required/i.test(textData) ||
        /manage_settings required/i.test(textData)
      ) {
        try {
          const m =
            textData.match(/Permission denied:\s*([^<\n<]+)/i) ||
            textData.match(/Error:\s*([^<\n<]+)/i) ||
            textData.match(/One of \[(.*?)\] required/i) ||
            textData.match(/manage_settings required/i);
          const friendly = m
            ? m[1] || m[0]
            : "You don't have permission to perform this action.";
          handleError(friendly);
        } catch (e) {
          /* ignore toast failures */
        }
      }
    }
  } catch (e) {
    // ignore parsing errors
  }
  const status = result?.error?.status;

  // Auto-logout only on 401 (unauthenticated). For 403 (forbidden) show a toast and keep the session.
  if (status === 401) {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
      }
      if (typeof document !== "undefined") {
        // Clear cookies if present
        document.cookie = "accessToken=; Max-Age=0; path=/";
        document.cookie = "token=; Max-Age=0; path=/";
      }
      if (typeof window !== "undefined") {
        window.location.href = "/login"; // redirect to login
      }
    } catch (_) {
      // ignore cleanup errors
    }
  } else if (status === 403) {
    try {
      // Prefer structured JSON message in result.error.data, then fallback to string extraction, else generic.
      let msg = "You don't have permission to perform this action.";
      const errData = result?.error?.data ?? result?.data;
      if (errData) {
        if (typeof errData === "object" && errData.message)
          msg = errData.message;
        else if (typeof errData === "string") {
          const m =
            errData.match(/Permission denied:\s*([^<\n<]+)/i) ||
            errData.match(/Error:\s*([^<\n<]+)/i) ||
            errData.match(/One of \[(.*?)\] required/i) ||
            errData.match(/manage_settings required/i);
          msg = m ? m[1] || m[0] : msg;
        }
      }
      handleError(msg);
    } catch (e) {
      // ignore toast failures
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithAutoLogout,
  tagTypes: ["User", "Report", "AdminMe", "Blogs"],
  endpoints: () => ({}),
});
