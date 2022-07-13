<template lang="pug">
div
  Toast(body="helloworld" title="hello!!" subtitle="true" :showing="true")
  h1 サレ祭サイト投稿
  div(v-if="useIsLogined()") 
    div ボタンから新しい企画を作成します。
    NuxtLink.btn.btn-primary(to="/new") 新しい企画を作成
    div ログアウトするには下をクリックします。
    NuxtLink.btn.btn-secondary(to="/logout") ログアウト
  div(v-else)
    div 投稿するにはまずログインしてください。
    NuxtLink.btn.btn-primary(to="/login") ログイン
</template>
<script setup lang="ts">
definePageMeta({ notRequireAuth: true });
</script>
