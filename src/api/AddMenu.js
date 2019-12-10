import request from '@/utils/request'
import qs from 'qs'

export function getMenuList(params) {
  return request({
    url: '/api/v1/admin-menu/parent',
    method: 'get',
    params
  })
}

export function getMenus(params) {
  return request({
    url: '/api/v1/admin-menu/index',
    method: 'get',
    params
  })
}

export function saveMenu(info) {
  const data = new window.FormData()
  info['access_token'] && data.append('access_token', info['access_token'])
  info['id'] && data.append('id', info['id'])
  info['parent_id'] && data.append('parent_id', info['parent_id'])
  info['order'] && data.append('order', info['order'])
  info['title'] && data.append('title', info['title'])
  info['method'] && data.append('method', info['method'])
  info['uri'] && data.append('uri', info['uri'])
  info['icon'] && data.append('uri', info['icon'])
  info['remark'] && data.append('uri', info['remark'])

  return request({
    url: '/api/v1/admin-menu/save',
    method: 'post',
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // },
    data
    // data: qs.stringify(data)
  })
}
