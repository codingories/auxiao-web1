import request from "@/utils/request";
import qs from "qs";

export function getTotalAttendance(params) {
  return request({
    url: "/api/v1/attendances",
    method: "get",
    params
  });
}
