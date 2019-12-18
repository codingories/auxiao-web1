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

export function getRoleInfo(params) {
  return request({
    url: '/api/v1/admin-role/show',
    method: 'get',
    params
  })
}

export function frozenRole(params) {
  return request({
    url: '/api/v1/admin-role/activate',
    method: 'get',
    params
  })
}

export function distributeUser(params) {
  console.log('params')
  console.log(params)
  return request({
    url: '/api/v1/admin-role/distribute-user',
    method: 'post',
    // params
    data: qs.stringify(params)
  })
}

export function getUsers(params) {
  console.log('params')
  console.log(params)
  return request({
    url: '/api/v1/admin-role/user-list',
    method: 'get',
    headers: { 'content-type': 'application/json' },
    params
  })
}

// request.put(
//   {
//     url: '/api/v1/admin-role/activate'
//   }
// )

// console.log(request.put({'/api/v1/admin-role/activate'}))
// return request({
//   url: '/api/v1/admin-role/activate',
//   method: 'put',
//   params
// })

// method: 'delete',
// url: '/api/v1/admin-role/del',
// headers: { 'content-type': 'application/x-www-form-urlencoded' },
// data: qs.stringify(data)

// headers: {
//   'Content-Type': 'multipart/form-data'
// },
// console.log('----data----')
// console.log(data1)
// const data = qs.stringify(data1)
// console.log(data)
// const options = {
//   method: 'DELETE',
//   headers: { 'content-type': 'application/x-www-form-urlencoded' },
//   data: data,
//   url: '/api/v1/admin-role/del'
// }
// return request(options)

// method: 'delete',
// headers: {
//   'Content-Type': 'application/x-www-form-urlencoded'
// },

// ({
//   method: 'delete',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   },
//   url: '/api/v1/admin-role/del',
//   data:qs.stringify(params)
// })

// Content-Type: application/x-www-form-urlencoded
