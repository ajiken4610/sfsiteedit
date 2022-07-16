<template lang="pug">
div
  Head(v-if="!pending")
    Title {{ project.title }}
    Meta(
      v-if="project.thumbnail",
      name="thumbnail",
      :content="project.thumbnail"
    )
    Meta(
      v-if="project.description",
      name="description",
      :content="project.description"
    )
  .display-1.text-center(v-if="pending") Loading...
  .project-wrapper(v-else)
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
    .title-owner-wrapper
      span.text-muted.tag(v-if="project.tags", v-for="tag in project.tags") {{ "#" + tag }}
      .h5(v-html="project.title")
      PartsShareButton.float-end
      .text-muted {{ project.owner }}
    hr
    .description-wrapper
      PartsMarkdownViewer.description(:src="project.description")
</template>

<script lang="ts">
import platform from "platform";
</script>
<script setup lang="ts">
import { SFProjectData } from "~/composables/firestore";
import { getDoc, doc } from "firebase/firestore";

const allowLoad = ref(false);
setTimeout(() => {
  allowLoad.value = true;
}, 2000);

const project = computed(() => toStrictProject(data.value?.project));

const route = useRoute();
const { pending, data } = useLazyAsyncData(
  route.fullPath + new Date(),
  async () => {
    try {
      const snapshot = await getDoc(
        doc(
          useFirestore(),
          route.query.submitted === "true" ? "project" : "draft",
          route.params.id.toString()
        )
      );
      return snapshot.data() as SFProjectData;
    } catch (e) {
      console.error(e);
      showToast({
        title: "エラー",
        body: "プロジェクトは存在しないか、アクセスする権限がありません。",
      });
      useRouter().replace({ path: "/404", query: { path: route.fullPath } });
    }
  }
);

const defaultRatio = computed(
  () =>
    ({ youtube: "56.25%" }?.[project.value?.type?.toString() || ""] || "100%")
);
</script>
<style scoped lang="scss">
.description > :not(:last-child) {
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

.project-wrapper > :not(:last-child) {
  margin-bottom: 1rem;
}
.tag:not(:first-child) {
  padding-left: 0.25em;
}
.horizontal-card-wrapper > * {
  max-width: 24rem;
}
.horizontal-card-wrapper > :not(:last-child) {
  margin-bottom: 1.5rem;
}
</style>
