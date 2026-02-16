import type { AccountResponse } from "../generated";
import { instance } from "../instance";

export enum AccountEndpoints {
  ME = "/account/me",
}

export const getMe = async () => {
  return await instance
    .get<AccountResponse>(AccountEndpoints.ME)
    .then((response) => response.data);
};
