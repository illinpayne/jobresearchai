import type { AccountResponse } from "../generated";
import { instance } from "../instance";

export const getMe = async () => {
  return await instance
    .get<AccountResponse>("/user/me")
    .then((response) => response.data);
};
