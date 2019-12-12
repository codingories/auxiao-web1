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
  console.log("---授权----")
  // const data = new window.FormData()
  // info['access_token'] && data.append('access_token', info['access_token'])
  // info['id'] && data.append('id', info['id'])
  // info['name'] && data.append('name', info['name'])
  // info['menus'] && data.append('menus', info['menus'])

  return request({
    url: '/api/v1/admin-role/save',
    method: 'post',
    data: qs.stringify(data)
  })
}
