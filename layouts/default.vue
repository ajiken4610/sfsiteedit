<template lang="pug">
div
  LayoutHeader
  slot
  LayoutFooter
  LayoutLoadingOverlay
  LayoutToastContainer(:toasts="toasts")
</template>

<script setup lang="ts">
const toasts = ref<
  { title?: string; subtitle?: string; body: string; key: number }[]
>([]);

watch(
  getShowingToasts(),
  (value) => {
    toasts.value = value;
  },
  { deep: true, immediate: true }
);

const router = useRouter();
const loading = ref(false);
const overlaying = ref(false);
router.beforeEach((to, from, next) => {
  loading.value = true;
  overlaying.value = true;
  next();
});
router.afterEach(() => {
  overlaying.value = false;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 1s ease;
}
.page-enter-from,
.page-leave-to,
.page-leave-active {
  transform: translateY(-100vh);
  opacity: 0;
}

.page-move {
  transition: all 1s ease;
}
</style>
