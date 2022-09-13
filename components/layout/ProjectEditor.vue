<template lang="pug">
.form-container(
  :class="{ 'not-editable': !(props.editable || useRoute().query.admin) }",
  ref="formContainer"
)
  Head
    Title {{ data.title || "Editor" }}
  div
    label.form-label(for="input-title") タイトル
      button.btn.btn-sm.p-0.ms-2.bi-question-circle(
        data-bs-toggle="tooltip",
        title="文字数制限はない。<br>20-40文字程度を想定。"
      )
    input#input-title.form-control(v-model="data.title", placeholder="タイトル...")
  div
    label.form-label(for="input-description") 詳細
      button.btn.btn-sm.p-0.ms-2.bi-question-circle(
        data-bs-toggle="tooltip",
        title="Markdown記法が利用できる。"
      )
    PartsFlexMonospaceEditor#input-description.form-control(
      v-model="data.description",
      placeholder="Markdown記法が利用できます"
    )
  div
    label.form-label(for="input-tags") タグ(検索キーワードとして参照されます。)
      button.btn.btn-sm.p-0.ms-2.bi-question-circle(
        data-bs-toggle="tooltip",
        title="多めに書いておくことを推奨します。"
      )
    VSelect(
      v-model="data.tags",
      multiple,
      :options="searchingText ? [searchingText] : []",
      @search="onTagTextInput"
    )
      template(#no-options) タグを入力してEnter
  div
    label.form-label(for="input-parent") 所属親
      button.btn.btn-sm.p-0.ms-2.bi-question-circle(
        data-bs-toggle="tooltip",
        title="所属の親を選択してください。<br>所属は作成することも可能です。"
      )
    VSelect(
      :options="owners",
      :reduce="(owner) => owner.id",
      v-model="data.owner"
    )
      template(#no-options) 検索にマッチする親がありません。
  div
    label.form-label(for="input-type") コンテンツタイプ
      button.btn.btn-sm.p-0.ms-2.bi-question-circle(
        data-bs-toggle="tooltip",
        title="無し: コンテンツが以下の6つに当てはまらない場合。<br>Youtube: コンテンツがYoutube動画の場合。<br>GoogleDrive: コンテンツがGoogleDriveのファイル(PDFやDocument,Spreadsheetなど)の場合。"
      )
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
      button.btn.btn-sm.p-0.ms-2.bi-question-circle(
        data-bs-toggle="tooltip",
        title="URLではありません。ファイルのIDです。"
      )
    input#input-id.form-control(v-model="data.id", placeholder="ファイル、動画のID")
    .form-text 必ずファイルコピー君で取得したURLのIDを使用してください。この欄に入力するのはURLではなくファイルのIDであることを忘れないでください。
  div
    label.form-label(for="input-thumbnail") サムネイルURL
      button.btn.btn-sm.p-0.ms-2.bi-question-circle(
        data-bs-toggle="tooltip",
        title="ドライブのファイルを用いる際は、<u>必ず</u>「ファイルコピー君」で取得したURLを使用してください。"
      )
    .input-group
      input#input-thumbnail.form-control(
        v-model="data.thumbnail",
        placeholder="サムネイル画像のURLを指定。JPEG>2MBを推奨。"
      )
      button.btn.btn-secondary(v-if="isIdExtractable", @click="extractId") ファイルIDから抽出
    .form-text 必ずファイルコピー君で取得したURLを使用してください。
  div
    label.form-label(for="input-ratio") コンテンツの比率
      button.btn.btn-sm.p-0.ms-2.bi-question-circle(
        data-bs-toggle="tooltip",
        title="入力しなければ自動で比率が決定します。"
      )
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
import * as bootstrap from "bootstrap";
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
const formContainer = ref<HTMLDivElement>();
onMounted(() => {
  var tooltipTriggerList = Array.prototype.slice.call(
    formContainer.value.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, { html: true });
  });
});
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
