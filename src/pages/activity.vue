<template>
  <Show :information="activityStore"></Show>
</template>

<script setup lang="ts">
import Show from "../components/Show.vue";
import { activityStore } from "../data/activityData"
</script>

<style scoped></style>
