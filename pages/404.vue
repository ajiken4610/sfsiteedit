<template lang="pug">
div
  h1 404 Not Found
  .lead "{{ route.query.path || route.path }}" は存在しないか、アクセスする権限がありません。
</template>
<script setup lang="ts">
const route = useRoute();
</script>
