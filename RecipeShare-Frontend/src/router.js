import { createMemoryHistory, createRouter } from 'vue-router'

import Home from './components/Home.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import RecipeEditor from './components/RecipeEditor.vue'

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
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/newRecipe',
        name: 'newRecipe',
        component: RecipeEditor
    }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router