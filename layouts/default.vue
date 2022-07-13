<template lang="pug">
div
  Header
  slot
  Footer
  LoadingOverlay
</template>

<script setup lang="ts">
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
router.onError((error) => {
  console.log("Routing error:", error);
  alert(
    "ページルーティング時にエラーが発生しました。\nページを再読み込みしてください。"
  );
  window.location.reload();
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
