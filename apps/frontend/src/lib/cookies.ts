import Cookies from "js-cookie";

export const setSessionToken = (token: string) => {
  Cookies.set("token", token);
};

export const getSessionToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return Cookies.get("token");
};

export const removeSessionToken = () => {
  Cookies.remove("token");
  Cookies.remove("refresh-token");
};
