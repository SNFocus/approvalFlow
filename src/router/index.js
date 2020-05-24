import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/views/admin/approver.vue"

Vue.use( VueRouter )

const routes = [
  {
    path: '/',
    redirect: '/approver'
  },
  {
    path: '/approver',
    name: 'approver',
    component: Home,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/preview',
    name: 'preview',
    component: () => import( "@/views/custom/preview.vue" ),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import( "@/views/custom/test.vue" )
  },
]

const router = new VueRouter( {
  routes
} )

export default router
