<template lang="pug">
.wrapper
  .forms
    label.form-label(for="input-apikey") APIキー
    input#input-apikey.form-control(placeholder="ひらがな変換APIのキー")
  .d-flex
    button.ms-auto.btn.btn-primary エキスポート
</template>

<script setup lang="ts">
import { SFProjectData } from "~~/composables/firestore";

defineProps<{ projects: { [key: string]: SFProjectData } }>();
</script>

<style scoped lang="scss">
.wrapper > :not(:last-child) {
  margin-bottom: 1em;
}
</style>
