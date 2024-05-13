import { createWebHistory, createRouter } from 'vue-router'

import Home from './components/Home.vue'
import NotFound from './components/NotFound.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import RecipeEditor from './components/RecipeEditor.vue'
import Admin from './components/Admin.vue'
import RecipeView from './components/RecipeView.vue'
import RecipeBook from './components/RecipeBook.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        
    },
    {
        path: '/recipes',
        name: 'recipeBook',
        component: RecipeBook,
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
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin
    },
    {
        path: '/recipe/:id',
        name: 'recipe',
        component: RecipeView
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
    history: createWebHistory(),    
    routes,
})

export default router