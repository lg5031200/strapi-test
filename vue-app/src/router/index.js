import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Me from '../components/Me.vue'
import CreateOrder from '../components/CreateOrder.vue'
import Order from '../views/Order'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/order',
    name: 'Order',
    component: Order
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/me',
    name: 'Me',
    component: Me
  },
  {
    path: '/add',
    name: 'Add',
    component: CreateOrder
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
