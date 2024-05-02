<script setup>
defineProps({
    navLinks: {
        type: Array,
        required: false
    }
})
</script>

<template>
    <nav>
        <ol>
            <li v-for="item in navLinks"><a :href="item.link">{{ item.name }}</a></li>
        </ol>
    </nav>
</template>

<style scoped>
ol {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
}

li {
  float: left;
}

li a {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

/* Change the link color to #111 (black) on hover */
li a:hover {
  background-color: #111;
}
</style>