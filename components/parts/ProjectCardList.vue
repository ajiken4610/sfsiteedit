<template lang="pug">
.row.row-cols-1.row-cols-sm-2.row-cols-xl-4.g-4
  .col(v-for="project in projects")
    PartsProjectCard(:project="toStrictProject(project)")
</template>

<script setup lang="ts">
import { SFProject } from "~~/composables/SFProject";

defineProps<{ projects: SFProject[] }>();
</script>
