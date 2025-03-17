<template>
    <Part :information="partIntroduction[1]"></Part>
</template>

<script setup lang="ts">
import Part from "../components/Part.vue";
import { usePartIntroductionStore } from "../stores/partIntroduction";
const {partIntroduction} = usePartIntroductionStore()
</script>

<style scoped>

</style>