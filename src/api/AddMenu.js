import request from '@/utils/request'
import qs from 'qs'

export function getMenuList(params) {
  return request({
    url: '/api/v1/admin-menu/parent',
    method: 'get',
    params
  })
}
