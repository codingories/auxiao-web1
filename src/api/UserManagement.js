import request from '@/utils/request'
import qs from 'qs'

export function getUsers(params) {
  return request({
    url: '/api/v1/admin-user/index',
    method: 'get',
    params
  })
}
