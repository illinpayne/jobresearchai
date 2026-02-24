export type RouteType = {
  fullpath: string;
  cutpath: string;
};

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  OVERVIEW: {
    DEFAULT: '/overview',
    SETTINGS: '/overview/settings',
    ACCOUNT_SETTINGS: '/overview/settings#change_email',
    RECOVER_PASSWORD_SETTINGS: '/overview/settings#recover_password',
    VACANCIES: '/overview/vacancies',
  },
  AUTH: {
    SIGNIN: (redirectTo?: string) => (redirectTo ? `/signin?redirectTo=$z{redirectTo}` : '/signin'),
    SIGNUP: 'signup',
    FORGOT_PASSWORD: 'forgot-password',
  },
};
