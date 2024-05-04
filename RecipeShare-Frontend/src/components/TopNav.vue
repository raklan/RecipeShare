<script setup>
import {computed} from 'vue'

const props = defineProps({
    navLinks: {
        type: Array,
        required: false
    },
    isLoggedIn: Boolean
})

const routes = computed(() => {
  const dontShowUser = ['/login', '/register']
  const dontShowAnonymous = ['/newRecipe']

  if(props.isLoggedIn === true){
    return props.navLinks.filter(link => !dontShowUser.includes(link.route))
  }else{
    return props.navLinks.filter(link => !dontShowAnonymous.includes(link.route))
  }
})

</script>

<template>
    <nav>
        <a v-if="isLoggedIn" @click="$emit('logout')" style="cursor: pointer">Log Out</a>
        <RouterLink v-for="item in routes" :to="item.route">{{item.name}}</RouterLink>
    </nav>
</template>

<style scoped>
nav {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color:peachpuff;
}

nav a {
  float: left;
  display: block;
  color: black;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 20px;
}

/* Change the link color to #111 (black) on hover */
nav a:hover {
  background-color: rgb(250, 224, 201);
}
</style>