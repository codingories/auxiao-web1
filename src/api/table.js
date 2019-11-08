import request from "@/utils/request";

export function getList(params) {
  return request({
    url: "/api/v1/attendance/statistics",
    method: "get",
    params
  });
}

// // 这个查询单个姓名
// export function getMainDetail(params) {
//   console.log("----------getMainDetail-params-------------");
//   console.log("params");
//   console.log(params);
//   return request({
//     url: "/api/v1/attendance/items",
//     method: "get",
//     params
//   });
// }

// export function getMainDetail(params) {
//   return request({
//     url: "/api/v1/attendances",
//     method: "get",
//     params
//   });
// }

export function getMainDetail(params) {
  return request({
    url: "/api/v1/attendance/details",
    method: "get",
    params
  });
}
