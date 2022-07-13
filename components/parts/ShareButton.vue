<template lang="pug">
.dropdown(:class="{copied}")
  i.share-button.bi-share.h3.dropdown-toggle(data-bs-toggle="dropdown")
  ul.dropdown-menu.dropdown-menu-dark.dropdown-menu-end
    li.dropdown-item(@click="openTwitter")
      span.bi-twitter
      span.share Twitter
    li.dropdown-item(@click="openLine")
      span.bi-line
      span.share Line
    li.dropdown-item(@click="copyToClipboard")
      span.bi-clipboard
      span.share Clipboard
    li.dropdown-item.shareAPI(v-if="shareAPIEnabled" @click="share" )
      span.bi-three-dots
      span.share Other

</template>

<script setup lang="ts">
const props = defineProps<{ link?: string; message?: string }>();
const message = props.message ?? "サレ祭のこの企画が面白い！";
const link = props.link ?? "https://" + location.host + useRoute().path;
const messageLink = "#サレ祭 #サレ祭2022\n" + message + "\n" + link + "\n";
const shareAPIEnabled = !!window.navigator.share;
const copied = ref(false);
function openTwitter() {
  window.open(
    "https://twitter.com/intent/tweet?text=" + encodeURIComponent(messageLink)
  );
}
function openLine() {
  window.open(
    "https://line.me/R/share?text=" + encodeURIComponent(messageLink)
  );
}
function copyToClipboard() {
  navigator.clipboard.writeText(messageLink).then(() => {
    copied.value = true;
    setTimeout(() => (copied.value = false), 5000);
  });
}
function share() {
  window.navigator.share({ title: message, url: link, text: messageLink });
}
</script>

<style scoped lang="scss">
.dropdown::before {
  transition: opacity 0.3s;
  opacity: 0;
  content: "Copied!";
  margin-right: 1rem;
}
.dropdown.copied::before {
  opacity: 1;
}
.share-button::after {
  display: none;
}
.share {
  margin-left: 1rem;
}
</style>
