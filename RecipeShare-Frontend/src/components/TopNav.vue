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
  if(props.isLoggedIn === true){
    return props.navLinks.filter(link => link.route !== '/login')
  }else{
    return props.navLinks
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
  background-color: #333;
}

nav a {
  float: left;
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

/* Change the link color to #111 (black) on hover */
nav a:hover {
  background-color: #111;
}
</style>