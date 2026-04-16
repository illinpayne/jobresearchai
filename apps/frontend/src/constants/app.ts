/** biome-ignore-all lint/complexity/useLiteralKeys: App config */
export const APP_CONFIG = {
  baseUrl: process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://jobresearch.com',
  apiUrl: process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:5000/api/v1',
} as const;

export const OAUTH_CONFIG = {
  clientId: process.env['NEXT_PUBLIC_OAUTH_ID'],
  secret: process.env['NEXT_PUBLIC_OAUTH_SECRET'],
  redirectPath: process.env['NEXT_PUBLIC_OAUTH_REDIRECT_PATH'],
  rootUrl: process.env['NEXT_PUBLIC_OAUTH_ROOT_URL'],
} as const;

export const STORAGE_CONFIG = {
  storageUrl: process.env['NEXT_PUBLIC_STORAGE_URL'],
};
