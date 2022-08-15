<template lang="pug">
.overlay.animatable.d-table(:class="{ overlaying, touchable: loading }")
  .display-1.d-table-cell.align-middle.text-center Loading...
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
</script>

<style scoped lang="scss">
.animatable {
  transition: opacity 1s;
}

.overlay {
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  content: "helloworld";
}

.overlay:not(.overlaying) {
  opacity: 0;
}
.overlay:not(.touchable) {
  visibility: hidden;
}
</style>
