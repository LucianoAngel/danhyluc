import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Principal',
    component: () => import(/* webpackChunkName: "about" */ '../components/Principal.vue')
  },
  {
    path: '/login',
    name: 'InicioSesion',
    component: () => import(/* webpackChunkName: "about" */ '../components/Login.vue')
  },
  {
    path: '/registro',
    name: 'Registro',
    component: () => import(/* webpackChunkName: "about" */ '../components/Register.vue')
  },
  {
    path: '/agregar-cliente',
    name: 'AgregarCliente',
    component: () => import(/* webpackChunkName: "about" */ '../components/AgregarCliente.vue')
  },
  {
    path: '/agregar-servidor',
    name: 'AgregarServidor',
    component: () => import(/* webpackChunkName: "about" */ '../components/AgregarServidor.vue')
  },
  {
    path: '/categoria',
    name: 'categoria',
    component: () => import(/* webpackChunkName: "about" */ '../components/Categoria.vue')
  },
  {
    path: '/servicios',
    name: 'servicios',
    component: () => import(/* webpackChunkName: "about" */ '../components/Servicios.vue')
  },
  {
    path: '/transacciones',
    name: 'transacciones',
    component: () => import(/* webpackChunkName: "about" */ '../components/Transacciones.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
