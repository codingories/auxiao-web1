import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: { title: 'home', icon: 'user' }
      }
    ]
  },

  {
    path: '/personalCenter',
    component: Layout,
    redirect: '/personalCenter',
    children: [
      {
        path: 'personalCenter',
        name: 'personalCenter',
        component: () => import('@/views/personalCenter/index'),
        meta: { title: '个人中心', icon: 'dashboard' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  {
    path: '/attendance',
    component: Layout,
    redirect: '/attendance/table',
    name: 'attendance',
    meta: { title: '考勤管理', icon: 'example', roles: ['admin']},
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '每日考勤', icon: 'table' ,roles: ['admin'] }
      },
      {
        path: 'TotalAttendance',
        name: 'TotalAttendance',
        component: () => import('@/views/attendance/index'),
        meta: { title: '考勤汇总', icon: 'tree' ,roles: ['admin']}
      },
      {
        path: 'AttendanceGroup',
        name: 'AttendanceGroup',
        component: () => import('@/views/AttendanceGroup/index'),
        meta: { title: '考勤组管理', icon: 'tree' }
      },
      {
        path: 'singleDay',
        name: 'singleDay',
        component: () => import('@/views/singleDay/index'),
        meta: { title: '单日页面调整', icon: 'calendar' }
      },
      {
        path: 'severalDays',
        name: 'severalDays',
        component: () => import('@/views/severalDays/index'),
        meta: { title: '多日页面调整', icon: 'calendar' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '物品管理', icon: 'form', roles: ['admin']}
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: '教室管理',
      icon: 'nested',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () =>
                  import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () =>
                  import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },
  {
    path: '/backstage',
    component: Layout,
    redirect: '/backstage/',
    name: 'backstage',
    meta: { title: '后台设置', icon: 'link' },
    children: [
      {
        path: 'AuthorityManagement',
        name: 'AuthorityManagement',
        component: () => import('@/views/AuthorityManagement/index'),
        meta: { title: '权限管理', icon: 'link' }
      },
      {
        path: 'UserManagement',
        name: 'UserManagement',
        component: () => import('@/views/UserManagement/index'),
        meta: { title: '用户管理', icon: 'link' }
      },
      {
        path: 'RoleManagement',
        name: 'RoleManagement',
        component: () => import('@/views/RoleManagement/index'),
        meta: { title: '角色管理', icon: 'link' }
      },
      {
        path: 'AddMenu',
        name: 'AddMenu',
        component: () => import('@/views/AddMenu/index'),
        meta: { title: '增加菜单', icon: 'link' }
      }
    ]
  },
  {
    path: '/workflow',
    component: Layout,
    redirect: '/workflow/',
    name: 'workflow',
    meta: { title: '办公流程', icon: 'tree' },
    children: [
      {
        path: 'MyApplication',
        name: 'MyApplication',
        component: () => import('@/views/MyApplication/index'),
        meta: { title: '我的申请', icon: 'tree' }
      },
      {
        path: 'MyApproval',
        name: 'MyApproval',
        component: () => import('@/views/MyApproval/index'),
        meta: { title: '我的审批', icon: 'tree' }
      },
      {
        path: 'SummaryProcess',
        name: 'SummaryProcess',
        component: () => import('@/views/SummaryProcess/index'),
        meta: { title: '流程汇总', icon: 'tree' }
      }
    ]
  }]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes:constantRoutes
    // constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
