<template lang="pug">
div
  .display-1.text-center(v-if="pending || !data") Loading...
  .form-container(v-else)
    Head
      Title {{ data.childRef[route.params.id.toString()]?.name }}
    div
      label.form-label(for="input-name") 所属名
      input#input-name.form-control(v-model="data.self.name")
    div
      label.form-label(for="input-description") 説明文
      PartsFlexMonospaceEditor#input-name.form-control(
        v-model="data.self.description"
      )
    div
      label.form-label(for="input-parent") 所属親
      VSelect(
        :options="options",
        :reduce="(owner) => owner.id",
        v-model="data.self.parent"
      )
        template(#no-options) 検索にマッチする親がありません。
    .d-flex
      button.btn.btn-primary.px-4.ms-auto(@click="saveData")
        .spinner-border.spinner-border-sm(v-if="savingData")
        template(v-else) 保存
</template>

<script setup lang="ts">
import { Owner } from "~~/composables/SFProject";

const route = useRoute();
const VSelect = useVSelect();
const { pending, data } = useLazyAsyncData(
  route.params.id.toString(),
  async () => {
    const data = (await getOwner()).data();
    return {
      parentRef: parentRefDataToChildRefData(data),
      childRef: data,
      self: data[route.params.id.toString()] as Owner,
    };
  }
);

const savingData = ref(false);
const saveData = async () => {
  savingData.value = true;
  await setOwner(route.params.id.toString(), data.value.self);
  savingData.value = false;
};

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
  const ret: { label: string; id: string }[] = [{ label: "NULL", id: null }];
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
        showToast({ title: "情報", body: "変更は保存されていません。" });
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
