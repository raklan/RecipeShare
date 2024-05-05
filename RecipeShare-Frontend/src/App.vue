<script setup>
import {ref, reactive, onMounted} from 'vue'
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
      name: 'New Recipe',
      route: '/newRecipe'
    }
  ],
  apiUrl: "http://192.168.0.77:3000",
  currentUser: {}
})


function login(user){
  vm.currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(vm.currentUser));
  router.push({path: '/'})
}

function registered(){
  router.push({path: '/login'})
}

function logout(){
  vm.currentUser = {};
  localStorage.removeItem("currentUser");
  router.push({path: '/'})
}

onMounted(() => {
  if(!(vm?.currentUser?.username && vm?.currentUser?.username.length > 0)){
    const lastUser = JSON.parse(localStorage.getItem("currentUser"))
    if (lastUser){
      vm.currentUser = lastUser
    }
  }
})
</script>

<template>
  <main>
  <TopNav @logout="logout" :nav-links="vm.navLinks" :is-logged-in="vm?.currentUser?.username && vm?.currentUser?.username.length > 0"></TopNav>  
    <div id="potato-container">
    </div>
    <RouterView v-slot="{Component}">
      <component @login="login" @registered="registered"
        :is="Component"
        :api-url="vm.apiUrl"
        :user="vm.currentUser"></component>
    </RouterView>
  </main>
</template>
