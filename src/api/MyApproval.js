import request from "@/utils/request";
import qs from "qs";

export function getUserFlowsApprovals({ access_token }) {
  return request({
    method: "get",
    url: `/api/v1/user-flows`,
    params: { access_token }
  });
}

export const getEntryDetail = ({ access_token, entry_id }) =>
  request({
    method: "get",
    url: `/api/v1/entries/${entry_id}`,
    params: { access_token, entry_id }
  });

export const resolvedApproval = ({ access_token, process_id, content }) =>
  request({
    method: "post",
    url: "/api/v1/proc/pass",
    data: qs.stringify({ access_token, process_id, content })
  });

export const rejectedApproval = ({ access_token, process_id, content }) =>
  request({
    method: "post",
    url: "/api/v1/proc/unpass",
    data: qs.stringify({ access_token, process_id, content })
  });
