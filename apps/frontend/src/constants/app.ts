/** biome-ignore-all lint/complexity/useLiteralKeys: App config */
export const APP_CONFIG = {
  baseUrl: process.env["NEXT_PUBLIC_APP_URL"] ?? "https://jobresearch.com",
  apiUrl: process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:5000/api/v1",
} as const;
