<template lang="pug">
.project-wrapper
  .title-owner-wrapper(v-if="project.type !== 'youtube'")
    span.text-muted.tag(v-if="project.tags", v-for="tag in project.tags") {{ "#" + tag }}
    h1(v-html="project.title")
    PartsShareButton.float-end
    .h5.text-muted {{ ownerName }}
  .iframe-wrapper(v-if="project.type !== 'none'")
    img(v-if="project.thumbnail", :src="project.thumbnail")
    .position-absolute.d-table.h-100.w-100 
      .display-1.d-table-cell.align-middle.text-center Loading...
    iframe(
      v-if="allowLoad",
      :src="getFrameLink(project)",
      frameborder="0",
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowfullscreen
    )
  .title-owner-wrapper(v-if="project.type === 'youtube'")
    span.text-muted.tag(v-if="project.tags", v-for="tag in project.tags") {{ "#" + tag }}
    .h5(v-html="project.title")
    PartsShareButton.float-end
    .text-muted {{ ownerName }}
  hr
  .description-wrapper
    PartsMarkdownViewer.description(:src="project.description")
</template>

<script setup lang="ts">
import { StrictSFProject } from "~~/composables/SFProject";

const props = defineProps<{ project: StrictSFProject }>();

const allowLoad = ref(false);
setTimeout(() => {
  allowLoad.value = true;
}, 2000);
const { data: owners } = await useOwnersData();

const ownerName = computed(() =>
  getOwnerName(owners.value.childRef, props.project.owner)
);

const defaultRatio = computed(
  () => ({ youtube: "56.25%" }?.[props.project.type || ""] || "100%")
);
</script>

<style scoped lang="scss">
.project-wrapper > :not(:last-child) {
  margin-bottom: 1rem;
}

.iframe-wrapper {
  position: relative;
  padding-bottom: min(90vh, v-bind("project?.ratio || defaultRatio"));
  height: 0;
  overflow: hidden;
  border-radius: 5px;
  background-color: rgba(127, 127, 127, 0.5);
}
.iframe-wrapper > iframe,
img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.iframe-wrapper > img {
  filter: blur(10px);
}
.description > :not(:last-child) {
  margin-bottom: 1rem;
}
.tag:not(:first-child) {
  padding-left: 0.25em;
}
</style>
