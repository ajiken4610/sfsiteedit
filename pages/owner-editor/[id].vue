<template lang="pug">
div
  .display-1.text-center(v-if="pending || !data") Loading...
  .form-container(v-else)
    Head
      Title {{ data.childRef[route.params.id.toString()]?.name }}
    .d-lg-flex
      h1.title 所属ID:
        code {{ route.params.id }}
        span の詳細
    .text-danger.lead このページをブックマークしてください！URLを紛失すると二度と開けません！
    div
      label.form-label(for="input-name") 所属名
      input#input-name.form-control(v-model="self.name")
    div
      label.form-label(for="input-description") 説明文
      PartsFlexMonospaceEditor#input-name.form-control(
        v-model="self.description"
      )
    div
      label.form-label(for="input-parent") 所属親
      VSelect(
        :options="options",
        :reduce="(owner) => owner.id",
        v-model="self.parent"
      )
        template(#no-options) 検索にマッチする親がありません。
    .d-flex
      button.btn.btn-primary.px-4.ms-auto(@click="saveData")
        .spinner-border.spinner-border-sm(v-if="savingData")
        template(v-else) 保存
    .card.card-body.bg-transparent.border-white(v-if="data.parentRef")
      h1 構造図
      PartsOwnerStructureView(:structure="data.parentRef")
</template>

<script setup lang="ts">
import { Owner } from "~~/composables/SFProject";

const route = useRoute();
const VSelect = useVSelect();
const { pending, data } = useOwnersData();

const savingData = ref(false);
const saveData = async () => {
  savingData.value = true;
  await setOwner(route.params.id.toString(), self.value);
  savingData.value = false;
};
const self = computed(() => data.value.childRef[route.params.id.toString()]);

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
  addSelectionToArray(data.value.parentRef, ret);
  return ret;
});

const isSaved = ref(true);
let saveWarnTimeoutId: number;
watch(
  data,
  () => {
    isSaved.value = false;
    if (saveWarnTimeoutId) {
      clearTimeout(saveWarnTimeoutId);
    }
    saveWarnTimeoutId = window.setTimeout(() => {
      if (!isSaved.value) {
        showToast({
          title: "情報",
          body: "変更を保存するには保存ボタンを押してください。",
        });
      }
    }, 6000);
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
.form-container > :not(:last-child) {
  margin-bottom: 1rem;
}
</style>
