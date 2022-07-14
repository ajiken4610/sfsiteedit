<template lang="pug">
.toast(:class="{ show }")
  .toast-header(v-if="title")
    strong.me-auto {{ title }}
    .text-muted {{ subtitleOrTime }}
  .toast-body {{ body }}
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string;
  subtitle?: string;
  body: string;
  show?: boolean;
}>();
const subtitleOrTime = computed(
  () =>
    props.subtitle ||
    (() => {
      const date = new Date();
      return (
        date.getHours() +
        "時" +
        date.getMinutes() +
        "分" +
        date.getSeconds() +
        "秒"
      );
    })()
);
</script>

<style scoped lang="scss">
.toast {
  pointer-events: none;
}
</style>
