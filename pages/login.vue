<template lang="pug">
div
  h1 ログイン
  #authui-container(ref="container")
</template>

<script setup lang="ts">
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
definePageMeta({ notRequireAuth: true });
const ui = useAuthUI();
const auth = useAuth();
const container = ref<HTMLElement>();
onMounted(() => {
  ui.start(container.value, {
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
      EmailAuthProvider.PROVIDER_ID,
    ],
    signInSuccessUrl: useRoute().query.redirect?.toString?.() || "/",
  });
});
</script>
