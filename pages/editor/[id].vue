<template lang="pug">
.display-1.text-center(v-if="pending || !data") Loading...
div(v-else)
  header.mb-2
    .d-lg-flex
      h1.title 企画ID:
        code {{ route.params.id }}
        span の詳細
      .ms-auto.text-end
        NuxtLink.btn.btn-primary(:to="'/preview/' + route.params.id") 企画プレビューを表示
    .text-danger.lead このページをブックマークしてください！URLを紛失すると二度と開けません！
    .text-muted このページはあなた({{ useUser().email }})だけが編集できます。
  PartsProjectEditor(
    :project="data.project",
    :id="route.params.id.toString()",
    :editable="data.uid === useUser().uid"
  )
</template>

<script setup lang="ts">
import { doc, getDoc } from "@firebase/firestore";
import { SFProjectData } from "~~/composables/firestore";
const route = useRoute();
const { pending, data } = useLazyAsyncData(
  route.params.id.toString(),
  async () => {
    try {
      const snapshot = await getDoc(
        doc(useFirestore(), "draft", route.params.id.toString())
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
</script>
