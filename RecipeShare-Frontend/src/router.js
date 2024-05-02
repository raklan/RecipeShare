import { createMemoryHistory, createRouter } from 'vue-router'

import Home from './components/Home.vue'
import Login from './components/Login.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
    },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router