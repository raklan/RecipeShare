<script setup>
import {ref, reactive, onMounted, computed} from 'vue'
import {useRouter} from 'vue-router'

import TopNav from './components/TopNav.vue'
import Login from './components/Login.vue'
import Home from './components/Home.vue'

const router = useRouter();

defineOptions({
  inheritAttrs: false
})

const vm = reactive({
  navLinks: [
    {
      name: 'Login',
      route: '/login'
    },
    {
    name: 'Home',
      route: '/'
    },
    {
      name: 'All Recipes',
      route: '/recipes'
    },
    {
      name: 'New Recipe',
      route: '/newRecipe'
    }
  ],
  apiUrl: "https://j5sytjka1h.execute-api.us-east-2.amazonaws.com",
  //apiUrl: 'http://192.168.0.77:2323',
  currentUser: {}
})

const adminUsers = ['ryan', 'christina']
const isAdmin = computed(() => {return adminUsers.includes(vm.currentUser?.username)})


function login(user){
  vm.currentUser = user;
  localStorage.setItem("ry_currentUser", JSON.stringify(vm.currentUser));
  router.push({path: '/'})
}

function registered(){
  router.push({path: '/login'})
}

function logout(){
  vm.currentUser = {};
  localStorage.removeItem("ry_currentUser");
  router.push({path: '/'})
  window.location.reload();
}

onMounted(() => {
  if(!(vm?.currentUser?.username && vm?.currentUser?.username.length > 0)){
    const lastUser = JSON.parse(localStorage.getItem("ry_currentUser"))
    if (lastUser){
      vm.currentUser = lastUser
    }
  }
})
</script>

<template>
  <main>
  <TopNav @logout="logout" :nav-links="vm.navLinks" :is-admin="isAdmin" :is-logged-in="vm?.currentUser?.username && vm?.currentUser?.username.length > 0"></TopNav>  
    <div id="potato-container">
    </div>
    <RouterView v-slot="{Component}" :key="$route.fullPath">
      <component @login="login" @registered="registered"
        :is="Component"
        :api-url="vm.apiUrl"
        :user="vm.currentUser"></component>
    </RouterView>
  </main>
</template>
