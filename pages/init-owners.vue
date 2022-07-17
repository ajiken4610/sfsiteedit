<template lang="pug">
div
  h1 所属の初期化
  .display-1.text-center(v-if="initializing") 初期化中...
  div(v-else)
    .form-wrapper.mb-2
      .input-group
        template(v-for="(prefix,index) of prefixes")
          input.form-control(v-model="prefixes[index]")
        button.btn.btn-light(v-if="!initialized", @click="init") 所属を初期化
        a.btn.btn-light(v-else, :href="href") CSVをダウンロード
    .card.card-body.bg-transparent.border-white(v-if="structure")
      h1 構造図
      PartsOwnerStructureView(:structure="structure")
</template>

<script lang="ts">
function getWrapped(...wrapper: string[]) {
  const owners = {
    クラス企画: {
      "1年": { A組: {}, B組: {}, C組: {}, D組: {} },
      "2年": { A組: {}, B組: {}, C組: {}, D組: {} },
      "3年": { A組: {}, B組: {}, C組: {}, D組: {} },
      "4年": { A組: {}, B組: {}, C組: {}, D組: {} },
      "5年": { A組: {}, B組: {}, C組: {}, D組: {}, E組: {}, F組: {} },
      "6年": { A組: {}, B組: {}, C組: {}, D組: {}, E組: {}, F組: {} },
    },
    有志企画: {},
    部活動: {
      文芸部: {
        歴史班: {},
        文芸班: {},
      },
      美術部: {
        写真班: {},
        美術班: {},
      },
      自然科学部: {
        物理班: {},
        生物班: {},
        化学班: {},
      },
      ESS同好会: {},
      吹奏楽部: {},
      ジャグリング部: {},
      ピアノ同好会: {},
      軽音楽部: {},
      鉄道模型部: {},
      カトリック研究会: {},
      囲碁将棋同好会: {},
    },
    体験授業: {},
    運営: {
      イベント班: {},
      アーチ班: {},
      装飾班: {},
      IT班: {},
      広報班: {},
      執行班: {},
      美術班: {},
      総務班: {},
      アカデミア班: {},
      会計班: {},
      実行委員: {},
    },
    委員会: {
      生徒会: {},
      図書: {},
    },
    教科: {
      美術: {},
      国際交流: {},
    },
    保護者会: {
      キルトBee: {},
    },
    生配信: {
      ライブ: {},
      アーカイブ: {},
    },
  };

  let ret = {};
  let inner = ret;
  for (var i = 0; i < wrapper.length - 1; i++) {
    inner = inner[wrapper[i]] = {};
  }
  inner[wrapper[wrapper.length - 1]] = owners;
  return ret;
}
</script>
<script setup lang="ts">
import { Owner } from "~/composables/SFProject";
if (useUser().email !== "admin@sfsiteedit.web.app") {
  useRouter().replace("/");
}
const initializing = ref(false);
const prefixes = ref(["sf", new Date().getFullYear().toString()]);

const initLoop = (
  owners: { [key: string]: any },
  ret: { [key: string]: any },
  retObj: { [key: string]: Owner },
  prefix: string = "",
  parent: string = null
) => {
  for (const owner in owners) {
    const id = Math.random().toString().substring(2);
    retObj[id] = {
      name: owner,
      description: owner,
      parent: parent,
    };
    ret[(prefix ? prefix + " " : "") + owner] = id;
    initLoop(
      owners[owner],
      ret,
      retObj,
      (prefix ? prefix + " " : "") + owner,
      id
    );
  }
};
const href = ref("");
function handleDownload(object: { [key: string]: string }) {
  var bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  var content = "";
  for (const key in object) {
    content += `${key},https://sfsiteedit.web.app/owner/${object[key]}
`;
  }
  var blob = new Blob([bom, content], { type: "text/csv" });
  // @ts-ignore
  if (window.navigator.msSaveBlob) {
    // @ts-ignore
    window.navigator.msSaveBlob(blob, "test.csv");
  } else {
    href.value = window.URL.createObjectURL(blob);
  }
}
const initialized = ref(false);
const structure = ref();
const init = async () => {
  const ret = {};
  const retObj = {};
  const owners = getWrapped(...prefixes.value);
  initializing.value = true;
  initLoop(owners, ret, retObj);
  if ((initialized.value = await setOwners(retObj))) {
    handleDownload(ret);
  }
  initializing.value = false;
  console.log((structure.value = parentRefDataToChildRefData(retObj)));
};
</script>
