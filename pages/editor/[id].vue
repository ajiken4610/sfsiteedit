<template lang="pug">
.display-1.text-center(v-if="pending || pendingOwners") Loading...
div(v-else)
  header.mb-2
    .d-lg-flex
      h1.title 企画ID:
        code {{ route.params.id }}
        span の詳細
      .ms-auto.text-end
        NuxtLink.btn.btn-primary(:to="'/preview/' + route.params.id") 企画プレビューを表示
    .text-danger.lead このページをブックマークしてください！URLを紛失すると二度と開けません！
    .text-muted このページは企画オーナー(UID:{{ data.uid }})だけが編集できます。
  LayoutProjectEditor(
    :project="data.project",
    :id="route.params.id.toString()",
    :editable="data.uid === useUser().uid",
    :owners="options"
  )
</template>

<script setup lang="ts">
import { Owner } from "~~/composables/SFProject";
import { doc, getDoc } from "@firebase/firestore";
import { SFProjectData } from "~~/composables/firestore";

const route = useRoute();
const { pending, data } = useProjectData(useRoute().params.id.toString(), true);
const { pending: pendingOwners, data: dataOwners } = await useOwnersData();

const addSelectionToArray = (
  data: object,
  ret: { label: string; id: string }[],
  prefix: string = ""
) => {
  for (const key in data) {
    const current: { name: string; childs?: {} } = data[key];
    ret.push({ label: prefix + current.name, id: key });
    if ("childs" in current) {
      addSelectionToArray(current.childs, ret, prefix + current.name + " ");
    }
  }
};

const options = computed(() => {
  const ret: { label: string; id: string }[] = [];
  addSelectionToArray(dataOwners.value.parentRef, ret);
  return ret;
});
</script>
