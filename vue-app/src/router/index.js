import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home";
import Me from "../views/Me";
import CreateOrder from "../views/CreateOrder";
import Order from "../views/Order";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home
  },
  {
    path: "/order",
    name: "Order",
    component: Order
  },
  {
    path: "/me",
    name: "Me",
    component: Me
  },
  {
    path: "/add",
    name: "Add",
    component: CreateOrder
  },
  { path: '*', redirect: '/home' }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
