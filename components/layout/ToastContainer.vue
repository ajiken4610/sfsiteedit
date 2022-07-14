<template lang="pug">
.p-3.block.d-flex(
  :class="['flex-column' + (verticalAlign === 'top' ? '-reverse' : ''), 'fixed-' + verticalAlign, { 'start-50 translate-middle-x': horizontalAlign === 'center' }, 'align-not-' + horizontalAlign]"
)
  TransitionGroup(name="toast-container")
    PartsToast.d-inline-block(
      v-for="toast in toasts",
      :key="toast.key",
      :title="toast.title",
      :subtitle="toast.subtitle",
      :body="toast.body",
      :show="true"
    )
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    toasts: { title?: string; subtitle?: string; body: string; key: number }[];
    horizontalAlign?: "start" | "center" | "end";
    verticalAlign?: "top" | "bottom";
  }>(),
  {
    horizontalAlign: "end",
    verticalAlign: "bottom",
  }
);
</script>

<style scoped lang="scss">
.block {
  pointer-events: none;
}
.block.align-not-start {
  right: auto;
}
.block.align-not-end {
  left: auto;
}
.block.flex-column-reverse > *:not(:last-child) {
  margin-top: 0.5rem;
}
.block.flex-column > *:not(:last-child) {
  margin-bottom: 0.5rem;
}
.toast-container-enter-active,
.toast-container-leave-active {
  transition: all 0.2s ease;
}
.toast-container-enter-from {
  opacity: 0;
  transform: translateX(50%);
}
.toast-container-leave-to {
  opacity: 0;
  transform: translateX(50%);
}
.toast-container-move {
  transition: transform 0.2s ease;
}
</style>
