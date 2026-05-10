export enum JobEndpoints {
  ME = "/job/me",
  PERSONAL_DATA = "/job/personal-data",
  CHANGE_AVATAR = "/job/change-avatar",
}

export const getMe = async () => {
  return await instance
    .get<JobResponse>(JobEndpoints.ME)
    .then((response) => response.data);
};
