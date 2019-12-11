import request from '@/utils/request'
import qs from 'qs'

export function getGroups(params) {
  return request({
    url: '/api/v1/attendance_groups',
    method: 'get',
    params
  })
}
