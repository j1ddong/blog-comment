const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.production.com'
  : process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  MAIN: `${BASE_URL}/main`,
  BLOGSEARCH: `${BASE_URL}/blog/search`
};
