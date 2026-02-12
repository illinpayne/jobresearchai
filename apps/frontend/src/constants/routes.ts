export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  OVERVIEW: "/overview",
  AUTH: {
    SIGNIN: (redirectTo?: string) =>
      redirectTo ? `/signin?redirectTo=${redirectTo}` : "/signin",
    SIGNUP: "signup",
    FORGOT_PASSWORD: "forgot-password",
  },
};
