import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    console.log('--state.addRoutes--')
    state.routes = constantRoutes.concat(routes)
    console.log(state.routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    console.log('进入了actions的generateRoutes0')
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || [] // 异步挂载的roles，如果是admin则所有的权限都挂上去
        console.log('-进入generateRoutes1-')
        console.log(accessedRoutes)
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles) // 如果不是admin，那么就动态的根据role去更新
        console.log('-进入generateRoutes2-')
        console.log(accessedRoutes)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
