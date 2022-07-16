<template lang="pug">
NuxtLayout
  NuxtPage.my-4.container(key="content")
</template>
<script setup lang="ts">
import "bootstrap";
import { Synchronizer, Sleeper } from "./composables/Utils";
const router = useRouter();
const synchronizer = new Synchronizer();
// 早すぎるナビゲーション回避
router.beforeEach((to, from, next) => {
  if (to.path === from.path) {
  } else {
    synchronizer.synchronized(async () => {
      next();
      await Sleeper.sleep(2000);
    });
  }
});
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | SF Edit` : "Salesio Festa Editor";
  },
});
router.onError((error) => {
  console.log("Routing error:", error);
  alert(
    "ページルーティング時にエラーが発生しました。\nページを再読み込みしてください。"
  );
  window.location.reload();
});
window.addEventListener("hashchange", (e) => {
  if (location.hash.match(/^#.*$/)) {
    document
      .getElementById(decodeURIComponent(location.hash.substring(1)))
      ?.scrollIntoView(true);
  } else {
    window.scroll({ top: 0, behavior: "smooth" });
  }
});
</script>

<style lang="scss">
@import "highlight.js/scss/github-dark.scss";
@import "firebaseui";

@import "bootstrap/scss/functions";
// Default variable overrides
$light: #dddddd;
$dark: #181b2c;

$body-bg: #181b2c;
$body-color: #fff;

$component-active-color: $body-color;
$component-active-bg: $body-bg;

$popover-bg: $body-bg;
$popover-border-color: $body-color;

$modal-content-bg: $body-bg;
$modal-content-color: $body-color;

$toast-header-color: $body-color;
$toast-background-color: rgba(black, 0.5);
$toast-header-background-color: rgba(black, 0.1);

$dropdown-link-color: $body-bg;

$btn-close-color: $body-color;

$card-height: 100%;

:root {
  --vs-controls-color: #ffffff;
  --vs-border-color: #ffffff;

  --vs-dropdown-bg: #181b2c;
  --vs-dropdown-color: #ffffff;
  --vs-dropdown-option-color: #ffffff;

  --vs-selected-bg: #181b2c;
  --vs-selected-color: #ffffff;

  --vs-search-input-color: #ffffff;

  --vs-dropdown-option--active-bg: #2d3353;
  --vs-dropdown-option--active-color: #ffffff;
}
@import "bootstrap/scss/bootstrap";

@import "vue-select/dist/vue-select.css";

@import "bootstrap-icons/font/bootstrap-icons.scss";

$custom-colors: (
  "sfsite": #181b2c,
);

$theme-colors: map-merge($theme-colors, $custom-colors);

a,
a:hover {
  color: $body-color;
}

a:not(:hover) {
  text-decoration: none;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(128, 128, 128, 0.5);
  border-radius: 3px;
  padding: 6px;
}

::-webkit-scrollbar-thumb {
  background: #292929;
  border-radius: 3px;
  border-top: solid 3px white;
  border-bottom: solid 3px white;
}

body:not(.modal-open) {
  overflow-y: scroll;
}
</style>
