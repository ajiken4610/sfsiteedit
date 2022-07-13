<template lang="pug">
footer.mt-3.py-4.container.animatable(:class="{ loading }")
  hr
  .text-muted.text-end @サレ祭2022
</template>
<script setup lang="ts">
const router = useRouter();
const loading = ref(false);

router.beforeEach((to, from, next) => {
  loading.value = true;
  next();
});
router.afterEach(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<style scoped lang="scss">
.animatable {
  transition: opacity 1s;
}
.loading {
  opacity: 0;
}
</style>
