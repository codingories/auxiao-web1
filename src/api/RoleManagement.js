import request from '@/utils/request'
import qs from 'qs'

export function getRoles(params) {
  return request({
    url: '/api/v1/admin-role/index',
    method: 'get',
    params
  })
}
