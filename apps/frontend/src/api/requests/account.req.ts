import type { AccountResponse, ChangePersonalDataDto } from '../generated';
import { instance } from '../instance';

export enum AccountEndpoints {
  ME = '/account/me',
  PERSONAL_DATA = '/account/personal-data',
  CHANGE_AVATAR = '/account/change_avatar',
}

export const getMe = async () => {
  return await instance.get<AccountResponse>(AccountEndpoints.ME).then((response) => response.data);
};

export const changePersonalData = async (dto: ChangePersonalDataDto) => {
  return await instance.put<AccountResponse>(AccountEndpoints.PERSONAL_DATA, dto).then((response) => response.data);
};

export const updateAvatar = async (form: FormData) => {
  return await instance.put<AccountResponse>(AccountEndpoints.PERSONAL_DATA, form).then((response) => response.data);
};
