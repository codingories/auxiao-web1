import request from '@/utils/request'
import qs from 'qs'

export function getRoles(params) {
  return request({
    url: '/api/v1/admin-role/index',
    method: 'get',
    params
  })
}

export function getTotalMenuList(params) {
  return request({
    url: '/api/v1/admin-menu/index',
    method: 'get',
    params
  })
}


export function authorizeRoles(data) {
  return request({
    url: '/api/v1/admin-role/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function delRoles(params) {
  return request({
    url: '/api/v1/admin-role/del',
    method: 'get',
    params
  })
}
