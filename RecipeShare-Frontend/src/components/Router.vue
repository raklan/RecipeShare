<script setup>
import { reactive, ref, computed } from "vue"
import TopNav from './TopNav.vue'
import Login from './Login.vue'
import NotFound from './NotFound.vue'
import Home from './Home.vue'

const routes = {
    '/': Home,
    '/login': Login
}

const vm = reactive({
    links: [
        {
            name: 'Login',
            link: '/login'
        },
        {
            name: 'See Recipes',
            link: '/'
        }
    ],
    currentPath: window.location.pathname
})

const currentView = computed(() => {
    return routes[vm.currentPath || '/']|| NotFound
    //return cmp? cmp.cmp : NotFound
})
</script>

<template>
    <header>
        <TopNav :nav-links="vm.links"></TopNav>
    </header>

    <component :is="currentView"></component>
</template>