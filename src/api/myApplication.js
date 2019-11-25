import request from "@/utils/request";

export function getEntries({ access_token }) {
  return request({
    method: "get",
    url: "/api/v1/entries",
    params: { access_token }
  });
}
/**
 * getEntryDetail
 */
export const getEntryDetail = ({ access_token, entry_id }) =>
  request({
    method: "get",
    url: `/api/v1/entries/${entry_id}`,
    params: { access_token, entry_id }
  });
