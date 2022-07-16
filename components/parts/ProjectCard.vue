<template lang="pug">
.card.project-card.bg-transparent.border-secondary.overflow-hidden(
  :class="{ horizontal: responsiveHorizontal, vertical: !responsiveHorizontal }"
)
  div(:class="{ 'row g-0 h-100': responsiveHorizontal }")
    .position-relative(:class="{ 'col-4 h-100': responsiveHorizontal }")
      img.card-img-top(
        v-if="props.project.thumbnail",
        :src="props.project.thumbnail"
      )
      .no-thumbnail(v-else)
        svg(height="100%", width="100%")
          rect(width="100%", height="100%", fill="#888")
          text(x="50%", y="50%", dy=".4em", text-anchor="middle") No thumbnail
    div(:class="{ 'col-8 d-table': responsiveHorizontal }")
      .card-body(
        :class="{ 'd-table-cell align-middle': responsiveHorizontal }"
      )
        .h6.card-title(v-html="props.project.title")
        .fs-light.text-muted.card-subtitle {{ props.project.owner }}
        PartsMarkdownViewer.card-text.description(
          :src="props.project.description || ''"
        )
      NuxtLink.stretched-link(:to="'/preview/' + props.project.pid")
</template>

<script setup lang="ts">
import { StrictSFProject } from "~~/composables/SFProject";

const props = withDefaults(
  defineProps<{
    project: StrictSFProject;
    horizontal?: boolean;
    responsive?: boolean;
  }>(),
  { horizontal: false, responsive: true }
);

const responsiveHorizontal = ref(576 > window.innerWidth || props.horizontal);
const onResize = () => {
  responsiveHorizontal.value = 576 > window.innerWidth || props.horizontal;
};
window.addEventListener("resize", onResize);
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});
</script>

<style scoped lang="scss">
.vertical .description,
.card-title {
  overflow: hidden;
  display: -webkit-box;
  box-orient: vertical;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  -webkit-line-clamp: 2;
}
.card-subtitle,
.card-owner,
.horizontal .description > :deep(*) {
  overflow: hidden;
  display: -webkit-box;
  box-orient: vertical;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  -webkit-line-clamp: 1;
}
.card-body {
  margin-bottom: 0;
}
.description:deep(*) {
  font-size: 100% !important;
}
.description:deep(img),
.description:deep(pre),
.description:deep(button),
.description:deep(a),
.description:deep(table),
.description:deep(iframe),
.description:deep(.table-of-contents) {
  display: none;
}

.card.vertical {
  max-height: 24rem;
}
.card.horizontal {
  height: 8rem;
}
.card.horizontal {
  &.card-img-top,
  .no-thumbnail {
    position: absolute;
    height: 100%;
  }
}

.card-img-top,
.no-thumbnail {
  object-fit: cover;
  height: 8rem;
  //filter: blur(1px);
}

.stretched-link:hover::after {
  background-color: rgba(255, 255, 255, 0.1);
}
.stretched-link::after {
  transition: background-color 0.5s;
}
.description {
  font-size: 0.7rem;
  background: white; // linear-gradient(white, transparent);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
