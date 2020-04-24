import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/views/home.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path:'/preview',
    name:'preview',
    component:()=>import("@/views/preview")
  },
  {
    path:'/test',
    name:'test',
    component:()=>import("@/views/preview/test.vue")
  },
]

const router = new VueRouter({
  routes
})

export default router
