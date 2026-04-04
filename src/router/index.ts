import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TestView from '../views/TestView.vue' 
import ACCESS from '../views/ACCESS.vue' 
import ACCESSEVENT from '@/views/ACCESS-EVENT.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'access',
      component: ACCESS,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/test',
      name: 'test',
      component: TestView,
    },
        {
      path: '/event',
      name: 'event',
      component: ACCESSEVENT,
    },
  ],
})

export default router