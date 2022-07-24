<template lang="pug">
.form-container(
  :class="{ 'not-editable': !(props.editable || useRoute().query.admin) }"
)
  Head
    Title {{ data.title || "Editor" }}
  div
    label.form-label(for="input-title") タイトル
    input#input-title.form-control(v-model="data.title", placeholder="タイトル...")
  div
    label.form-label(for="input-description") 詳細
    PartsFlexMonospaceEditor#input-description.form-control(
      v-model="data.description",
      placeholder="Markdown記法が利用できます"
    )
  div
    label.form-label(for="input-tags") タグ(検索キーワードとして参照されます。)
    VSelect(
      v-model="data.tags",
      multiple,
      :options="searchingText ? [searchingText] : []",
      @search="onTagTextInput"
    )
      template(#no-options) タグを入力してEnter
  div
    label.form-label(for="input-parent") 所属親
    VSelect(
      :options="owners",
      :reduce="(owner) => owner.id",
      v-model="data.owner"
    )
      template(#no-options) 検索にマッチする親がありません。
  div
    label.form-label(for="input-type") コンテンツタイプ
    select#input-type.form-control(v-model="data.type")
      option(:value="undefined", disabled) 選択してください
      option(value="none") 無し
      option(value="youtube") Youtube
      option(value="drive") GoogleDrive
      option(value="drive-raw") GoogleDrive生ファイル
      option(value="github") Github
      option(value="gist") Gist
      option(value="iframe") サイト埋め込み
  div
    label.form-label(for="input-id") ファイルID
    input#input-id.form-control(v-model="data.id", placeholder="ファイル、動画のID")
  div
    label.form-label(for="input-thumbnail") サムネイルURL
    .input-group
      input#input-thumbnail.form-control(
        v-model="data.thumbnail",
        placeholder="サムネイル画像のURLを指定。JPEG>2MBを推奨。"
      )
      button.btn.btn-secondary(v-if="isIdExtractable", @click="extractId") ファイルIDから抽出
  div
    label.form-label(for="input-ratio") コンテンツの比率
    input#input-ratio.form-control(
      v-model="data.ratio",
      placeholder="「height/width%」を入力。%以外にもCSSで使用できる単位が使用可能。"
    )
  .d-flex
    button.btn.btn-outline-danger.px-4(@click="resetData") リセット
    button.btn.btn-primary.ms-auto.px-4(
      @click="saveData",
      :class="{ disabled: savingData }"
    )
      .spinner-border.spinner-border-sm(v-if="savingData")
      template(v-else-if="!isSaved") 保存
      template(v-else) 提出

  .position-fixed.bottom-0.start-50.p-4.translate-middle-x
    button.btn.btn-primary.px-4(
      @click="saveData",
      :class="{ disabled: savingData }"
    )
      .spinner-border.spinner-border-sm(v-if="savingData")
      template(v-else-if="!isSaved") 保存
      template(v-else) 提出
</template>

<script setup lang="ts">
import { onBeforeRouteLeave } from "vue-router";
import getYoutubeThumbnailUrl from "~~/composables/getYoutubeThumbnailUrl";
import { SFProject } from "~~/composables/SFProject";
const VSelect = useVSelect();
const props = withDefaults(
  defineProps<{
    project: SFProject;
    id: string;
    owners: { label: string; id: string }[];
    editable?: boolean;
  }>(),
  { editable: true }
);
watch(
  props,
  () => {
    if (props.editable || useRoute().query.admin) {
    } else {
      console.log(props.editable);
      showToast({
        title: "権限なし",
        body: "あなたはこの企画のオーナーではないため、変更を加えることはできません。",
      });
    }
  },
  { deep: true, immediate: true }
);

const data = ref(props.project);

const searchingText = ref("");
function onTagTextInput(search: string) {
  searchingText.value = search;
}

const isIdExtractable = computed(() => data.value.type === "youtube");
async function extractId() {
  if (data.value.type === "youtube") {
    data.value.thumbnail = data.value.id
      ? getYoutubeThumbnailUrl(data.value.id)
      : "";
  }
}
const resetData = () => {
  if (confirm("すべての項目がリセットされます。\nよろしいですか？")) {
    data.value = {};
  }
};
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
onBeforeRouteLeave((to, from, next) => {
  if (!isSaved.value) {
    if (confirm("変更を破棄しますか？")) {
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});
const beforeUnload = (event: Event) => {
  if (!isSaved.value) {
    event.preventDefault();
    event.returnValue = true;
  }
};
window.addEventListener("beforeunload", beforeUnload);
onUnmounted(() => {
  window.removeEventListener("beforeunload", beforeUnload);
});
const savingData = ref(false);
const saveData = async () => {
  savingData.value = true;
  if (isSaved.value) {
    if (confirm("企画を提出しますか？\n再提出することも可能です。")) {
      await submitProject(props.id, data.value);
    }
  } else {
    await setProject(props.id, data.value);
    isSaved.value = true;
  }

  savingData.value = false;
};
</script>

<style scoped lang="scss">
.form-container > :not(:last-child) {
  margin-bottom: 1rem;
}

.form-container.not-editable:deep(*) {
  pointer-events: none;
}
.form-container.not-editable::before {
  content: "編集権限がありません";
  color: red;
  font-size: 2rem;
}
</style>
