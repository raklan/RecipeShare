<script setup>
import {reactive} from 'vue'

const emit = defineEmits(['login'])
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
    loginUrl: `${props.apiUrl}/login`,
    username: '',
    password: '',
    loginError: ''
})

function login(event) {
    const reqBody = {
        'username': vm.username,
        'password': vm.password
    }

    fetch(vm.loginUrl, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody)
    }).then(resp => resp.json()).then(apiObj => {
        //Rudimentary error check - Check if SOMEthing was returned and that there's no error
        if(apiObj && !apiObj.error){
            emit('login', apiObj);
        }else{
            vm.loginError = apiObj?.error
        }
    })
}
</script>

<template>
    <form @submit.prevent="login" method="POST" class="login-form">
        Enter User details:
        <div id="username-box">
            <input type="text" autocomplete="off" name="username" id="username" placeholder="Username" v-model.trim="vm.username" />
        </div>
        <div id="password-box">
            <input type="password" name="password" id="password" placeholder="Password" v-model.trim="vm.password" />
        </div>
        <div id="submit-box">
            <input type="submit"/>
        </div>
    </form>
    <p>{{ vm.loginError }}</p>
    <div>Don't have an account? <RouterLink to="/register">Create One Here!</RouterLink></div>
</template>