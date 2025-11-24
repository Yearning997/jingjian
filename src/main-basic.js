import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './style.css'

// 路由配置
const routes = [
  {
    path: '/',
    component: () => import('./components/Layout-basic.vue'),
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('./views/Dashboard-minimal.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/members',
        name: 'Members',
        component: () => import('./views/Members.vue'),
        meta: { title: '会员管理' }
      },
      {
        path: '/equipment',
        name: 'Equipment',
        component: () => import('./views/Equipment.vue'),
        meta: { title: '设备管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')