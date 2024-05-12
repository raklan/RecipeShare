<script setup>

import { onMounted, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const props = defineProps({
    apiUrl: {
        type: String,
        required: true
    },
    user: {
        type: Object,
        required: true
    }
})

defineOptions({
    inheritAttrs: false
})

const vm = reactive({
    details: {}
})

onMounted(() => {
    fetch(`${props.apiUrl}/recipe?id=${route.params.id}`)
    .then(resp => resp.json())
    .then(apiObj => {
        if(apiObj && apiObj.data){
            vm.details = apiObj.data;
        }else{
            alert(apiObj.error?.message)
        }
    })
})

</script>

<template>
    <div>
        <h3>{{ vm.details.recipe?.name }}</h3> 
        <span style="font-style: italic;">by {{ vm.details.recipe?.author }}</span>
        <div>Difficulty: {{ vm.details.recipe?.difficulty }}/5</div>
        <div>Cost: ${{ vm.details.recipe?.cost }}</div>
        <div>Prep Time: {{ vm.details.recipe?.preptime }}</div>
        <div>Categories: {{ vm.details.recipe?.categories?.map(o => o.name).join(", ") }}</div>
    </div>

    <div>
        <div v-for="(i, index) in vm.details.ingredientSets">
            <h4>Ingredient Set {{ index + 1 }}</h4>
            <ul>
                <li v-for="x in JSON.parse(i.ingredients)">{{ x }}</li>
            </ul>
        </div>
    </div>

    <div>
        <div v-for="(i, index) in vm.details.stepSets">
            <h4>Step Set {{ index + 1 }}</h4>
            <ul>
                <li v-for="x in JSON.parse(i.steps)">{{ x }}</li>
            </ul>
        </div>
    </div>
</template>

<style scoped></style>