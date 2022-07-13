<template lang="pug">
div
  nav.navbar.navbar-expand-lg.navbar-dark.bg-dark.shadow-lg
    .container-fluid
      NuxtLink.navbar-brand(to="/") SF Site Preview
      button.navbar-toggler(type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation')
        span.navbar-toggler-icon
      #navbarSupportedContent.collapse.navbar-collapse
        ul.navbar-nav.me-auto.mb-2.mb-lg-0
          li.nav-item
            NuxtLink.nav-link.active(aria-current='page' to="/new") New project &gt;&gt;&gt;
  slot
  footer.mt-3.py-4.container.animatable(:class="{loading}")
    hr
    .text-muted.text-end @サレ祭2022

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

<style scoped lang="scss">
.animatable {
  transition: opacity 1s;
}
.loading {
  opacity: 0;
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
