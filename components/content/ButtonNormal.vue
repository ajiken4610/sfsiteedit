<template lang="pug">
NuxtLink(:to="$props.link")
  button.btn.btn-primary.mb-2
    Markdown(unwrap="p" :use="$slots.default")
</template>
<script setup lang="ts">
defineProps<{ link: string }>();
</script>
