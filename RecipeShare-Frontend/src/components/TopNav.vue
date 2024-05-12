<script setup>
import { computed } from 'vue'

const props = defineProps({
  navLinks: {
    type: Array,
    required: false
  },
  isLoggedIn: Boolean,
  isAdmin: Boolean
})

const routes = computed(() => {
  const dontShowUser = ['/login', '/register']
  const dontShowAnonymous = ['/newRecipe']

  if (props.isLoggedIn === true) {
    return props.navLinks.filter(link => !dontShowUser.includes(link.route))
  } else {
    return props.navLinks.filter(link => !dontShowAnonymous.includes(link.route))
  }
})
</script>

<template>
  <nav class="navbar sticky-top navbar-expand-md">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <a v-if="isLoggedIn" @click="$emit('logout')" style="cursor: pointer">Log Out</a>
        <RouterLink v-for="item in routes" :to="item.route">{{ item.name }}</RouterLink>
        <RouterLink v-if="props.isAdmin === true" to="/admin">Admin</RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: peachpuff;
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