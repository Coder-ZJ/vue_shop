import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/Login.vue'
import Home from '../views/home/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

// 挂载前置路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !sessionStorage.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
