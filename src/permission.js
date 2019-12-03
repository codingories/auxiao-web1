import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration`

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  // next({ path: "/" });
  // NProgress.done();
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0; // 这里来获取用户权限
      console.log('--hasRoles--')
      console.log(store.getters.roles)
      console.log(hasRoles)
      if (hasRoles) {
        next();
      } else {
        try {
          const roles = ['admin']
          store.getters.roles = roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          console.log("--accessRoutes--",accessRoutes)
          router.addRoutes(accessRoutes); // 根据roles动态的挂载路由
          console.log("---router---")
          console.log(router)
          next({ ...to, replace: true });
          // next();
        }
        catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }

      // const hasGetUserInfo = store.getters.name
      // if (hasGetUserInfo) {
      //   next()
      // } else {
      //   try {
      //     // get user info
      //     console.log('------======--------')
      //     console.log('进入到permission')
      //     // await store.dispatch("user/getInfo"); // 这里进行了"user/getInfo"请求,就是这一行没能进入到界面
      //     const roles = ['admin']
      //     const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
      //     router.addRoutes(accessRoutes) // 根据roles动态的挂载路由
      //     // next({ ...to, replace: true })
      //     console.log('--- ... to----- ')
      //     console.log({...to})
      //     // next()
      //     next({ ...to, replace: true })
      //   } catch (error) {
      //     // remove token and go to login page to re-login
      //     await store.dispatch('user/resetToken')
      //     Message.error(error || 'Has Error')
      //     next(`/login?redirect=${to.path}`)
      //     NProgress.done()
      //   }
      // }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
