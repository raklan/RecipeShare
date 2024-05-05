<script setup>
import {reactive} from 'vue'

const emit = defineEmits(['registered'])
const props = defineProps({
    apiUrl: {
        type: String,
        required: true
    },
    user: {
        type: Object,
        required: false
    }
})

defineOptions({
  inheritAttrs: false
})

const vm = reactive({
    registerUrl: `${props.apiUrl}/register`,
    username: '',
    password: '',
    registerError: ''
})

function register(event) {
    const reqBody = {
        'username': vm.username,
        'password': vm.password
    }

    fetch(vm.registerUrl, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody)
    }).then(resp => resp.json()).then(apiObj => {
        //Rudimentary error check - Check if SOMEthing was returned and that there's no error
        if(apiObj && !apiObj.error){
            emit('registered', apiObj);
        }else{
            vm.registerError = apiObj?.error
        }
    })
}
</script>

<template>
    <form @submit.prevent="register" method="POST" class="register-form">
        Register Here!
        <div id="username-box">
            <input type="text" name="username" autocomplete="off" id="username" placeholder="Username" v-model.trim="vm.username" />
        </div>
        <div id="password-box">
            <input type="password" name="password" id="password" placeholder="Password" v-model.trim="vm.password" />
        </div>
        <div id="submit-box">
            <input type="submit"/>
        </div>
    </form>
    <p>{{ vm.registerError }}</p>
</template>