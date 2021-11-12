import * as VueRouter from 'vue-router'
import store from '../store'

//Define routes
// Each route should map to a component.
const routes = [
  {
    path: '/guest',
    name: 'guest',
    meta: { guest: true },
    component: () => import(/* webpackChunkName: "guestlayout" */'@/components/GuestLayout'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */'@/views/LoginPage')
      }, 
      { 
        path: 'signup',
        name: 'signup',
        component: () => import(/* webpackChunkName: "signup" */'@/views/SignupPage')
      },
    ]
  },
  {
    path: '/',
    name: 'home',
    meta: { auth: true },
    component: () => import(/* webpackChunkName: "homepage" */'@/views/HomePage'),
  }, 
  {
    path: '/createpost',
    name: 'createpost',
    component: () => import(/* webpackChunkName: "createpost" */'@/views/CreatePostPage')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import(/* webpackChunkName: "accountlayout" */'@/components/AccountLayout'),
    children: [
      {
        path: '',
        name: 'account',
        component: () => import(/* webpackChunkName: "accountinfo" */'@/views/AccountInfoPage')
      },
      {
        path: 'changepassword',
        name: 'changepassword',
        component: () => import(/* webpackChunkName: "changepassword" */'@/views/ChangePasswordPage')
      },
      {
        path: 'usercontent',
        name: 'usercontent',
        component: () => import(/* webpackChunkName: "usercontent" */'@/views/UserContentPage')
      }
    ]
  }
]
  //Create the router instance and pass the `routes` option
  const router = VueRouter.createRouter({
    // Provide the history implementation to use.
    history: VueRouter.createWebHashHistory(),
    routes,
  })
  router.beforeEach(async(to, from, next) => {
    if (to.matched.some(record => record.meta.guest)) {
      // Guests only
      if (store.getters['isAuthenticated']) {
        // Authenticated, redirect to homepage
        next('/')
      } else {
        // Guest, continue
        next()
      }
    } else if (to.matched.some(record => record.meta.auth)) {
      // Authentication required
      if (store.getters['isAuthenticated']) {
        // Authenticated and verified, continue
        next()
      } else {
        // Guest, redirect to login page
        next('/guest/login')
      }
    } else {
      next()
    }
  })

export default router  
