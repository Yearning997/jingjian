import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './style.css'

// 简化的路由配置
const routes = [
  {
    path: '/',
    component: () => import('./views/Dashboard-minimal.vue'),
    meta: { title: '首页' }
  }
]

const router = createRouter({
  history: createWebHistory('/jingjian/'),
  routes
})

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')