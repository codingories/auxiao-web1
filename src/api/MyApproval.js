import request from "@/utils/request";

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
