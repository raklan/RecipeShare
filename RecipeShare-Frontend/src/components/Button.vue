<script setup>
const props = defineProps({
    buttonText: {
        type: String,
        required: false
    }
})
</script>

<template>
    <button class="button" type="button"><slot></slot></button>
</template>

<style scoped>
button {
  display: inline-block;
  text-align: center;
  font-weight: bold;
  border: 3px solid black;
  border-radius: 2px;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.1);
  color: black;
  text-decoration: none;
  transition: 0.3s ease all;
  z-index: 1;
}

button:before {
  transition: 0.5s all ease;
  position: absolute;
  top: 0;
  left: 50%;
  right: 50%;
  bottom: 0;
  opacity: 0;
  content: '';
  background-color: peachpuff;
  z-index: -1;
}

button:hover, button:focus {
  color: black;
}

button:hover:before, button:focus:before {
  transition: 0.5s all ease;
  left: 0;
  right: 0;
  opacity: 1;
}

button:active {
  transform: scale(0.9);
}
</style>