import request from "@/utils/request";
import qs from "qs";

export function getPersonalInfo(user_id, access_token) {
  return request({
    url: `/api/v1/users/${user_id}`,
    method: "get",
    params: { user_id, access_token }
  });
}

export function editUserInfo(data) {
  return request({
    method: "post",
    url: "/api/v1/user/edit_info",
    data: qs.stringify(data)
  });
}

export function changePassword(data) {
  return request({
    method: "post",
    url: "/api/v1/change/password",
    data: qs.stringify(data)
  });
}
