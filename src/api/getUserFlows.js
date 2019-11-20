import request from "@/utils/request";
import qs from "qs";
import axios from "axios";

// export function getUserFlows(token) {
//   return axios({
//     url: "https://xjyey.auxiao.com/api/v1/user-flows",
//     method: "get",
//     params: { token }
//   });
// }

export function getUserFlows(token) {
  return request({
    url: "api/v1/user-flows",
    method: "get",
    params: { token }
  });
}

export function getFlowTemplate(obj) {
  console.log(obj);
  let access_token = obj["accessToken"];
  let flow_id = obj["flow_id"];
  return request({
    url: `/api/v1/flows/${flow_id}`,
    method: "get",
    params: { access_token, flow_id }
  });
}

// export const getFlowTemplate = ({
//   access_token,
//   flow_id
// }: {
//   access_token: string,
//   flow_id: string
// }) =>
//   axios({
//     method: "get",
//     url: `/api/v1/flows/${flow_id}`,
//     params: { access_token, flow_id }
//   });
