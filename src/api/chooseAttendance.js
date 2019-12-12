import request from "@/utils/request";
import qs from "qs";

export function chooseAttendanceGroup(data) {
  return request({
    url: "/api/v1/attendance_group/user",
    method: "post",
    data: qs.stringify(data)
  });
}
