<template lang="pug">
div
  .display-1.text-center(
    v-if="(pending || pendingDraft) && projectData && draft"
  ) Loading...
  div(v-else)
    .mb-4
      h1 Projects
      PartsProjectCardList(:projects="projects")
    div
      h1 Drafts
      PartsProjectCardList(:projects="draftProjects")
</template>
<script setup lang="ts">
import { collection, getDocs } from "@firebase/firestore";
import { SFProjectData } from "~~/composables/firestore";
import { SFProject } from "~~/composables/SFProject";

const { pending, data: projectData } = useLazyAsyncData(
  "projectList",
  async () => {
    try {
      const db = useFirestore();
      const snapshot = await getDocs(collection(db, "project"));
      const ret: { [key: string]: SFProjectData } = {};
      snapshot.forEach((document) => {
        ret[document.id] = document.data() as SFProjectData;
      });
      return ret;
    } catch (e) {
      console.error(e);
      useRouter().replace({
        path: "/404",
        query: { path: useRoute().fullPath },
      });
    }
  }
);

const projects = computed(() => {
  const ret: SFProject[] = [];
  for (const current in projectData.value) {
    ret.push(projectData.value[current].project);
  }
  return ret;
});

const { pending: pendingDraft, data: draft } = useLazyAsyncData(
  "draftList",
  async () => {
    try {
      const db = useFirestore();
      const snapshot = await getDocs(collection(db, "draft"));
      const ret: { [key: string]: SFProjectData } = {};
      snapshot.forEach((document) => {
        ret[document.id] = document.data() as SFProjectData;
      });
      return ret;
    } catch (e) {
      console.error(e);
      useRouter().replace({
        path: "/404",
        query: { path: useRoute().fullPath },
      });
    }
  }
);

const draftProjects = computed(() => {
  const ret: SFProject[] = [];
  for (const projectData in draft.value) {
    ret.push(draft.value[projectData].project);
  }
  return ret;
});
</script>
