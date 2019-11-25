import request from "@/utils/request";
import qs from "qs";

export function login(data) {
  console.log(data);
  return request({
    url: "/api/v1/login",
    method: "post",
    data: qs.stringify(data)
  });
}

export function getInfo(token) {
  return request({
    url: "/user/info",
    method: "get",
    params: { token }
  });
}

// export function logout() {
//   return request({
//     url: "/user/logout",
//     method: "post"
//   });
// }

export function logout(data) {
  // console.log(data);
  // const data1 = new window.FormData();
  // data1.append("access_token", data);
  // console.log("user/api下的logout," + data);
  let obj = {
    // headers: {
    //   "Content-Type": "multipart/form-data"
    // },
    url: "/api/v1/logout",
    method: "post",
    access_token: data
  };
  // obj.access_token = data;

  return request(obj);
}
