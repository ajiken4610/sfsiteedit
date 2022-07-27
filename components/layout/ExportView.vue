<template lang="pug">
.wrapper
  button.ms-auto.btn.btn-primary(@click="exportData", v-if="!result") エキスポート
  .result(v-if="result") 
    .d-flex
      button.ms-auto.btn.btn-primary(@click="copyData") Copy
    code {{ result }}
</template>

<script setup lang="ts">
import { SFProjectData } from "~~/composables/firestore";
import { Owner } from "~~/composables/SFProject";

const props = defineProps<{
  projects: { [key: string]: SFProjectData };
}>();
const result = ref("");

const generationLoop = (
  data: {
    [key: string]: {
      childs: {};
      name: string;
      description: string;
      parent: string;
    };
  },
  ret: {
    [key: string]: {
      childIds: string[];
      name: string;
      description: string;
      parent: string;
    };
  }
) => {
  for (const currentKey in data) {
    const currentOld = data[currentKey];
    const current = {
      name: currentOld.name,
      description: currentOld.description,
      parent: currentOld.parent?.substring?.(0, 6),
      childIds: (() => {
        const ret: string[] = [];
        for (const key in currentOld.childs) {
          ret.push(key.substring(0, 6));
        }
        return ret;
      })(),
    };
    if (currentOld.childs) {
      generationLoop(currentOld.childs, ret);
    }
    ret[currentKey.substring(0, 6)] = current;
  }
};

const generateParentIdRef = (parentRef: {
  [key: string]: {
    childs: {};
    name: string;
    description: string;
    parent: string;
  };
}) => {
  const idRet = {};
  generationLoop(parentRef, idRet);
  return idRet;
};

const exportData = async () => {
  const { data: owners } = await useOwnersData();
  const ret: {
    projects?: { [key: string]: SFProjectData };
    owners?: { [key: string]: Owner };
    bigrams?: {
      projects: { [key: string]: string[] };
      owners: { [key: string]: string[] };
    };
  } = {};
  ret.owners = generateParentIdRef(owners.value.parentRef);

  const retProjects = {};
  for (const key in props.projects) {
    const current = props.projects[key].project;
    const ret: SFProjectData = {
      project: {
        title: current.title,
        description: current.description,
        id: current.id,
        owner: current.owner.substring(0, 6),
        pid: current.pid.substring(0, 6),
        ratio: current.ratio,
        tags: current.tags,
        thumbnail: current.thumbnail,
        type: current.type,
      },
      uid: key.substring(0, 6),
    };

    retProjects[key.substring(0, 6)] = ret;
  }
  ret.projects = retProjects;
  const bigrams: {
    projects: { [key: string]: string[] };
    owners: { [key: string]: string[] };
  } = { projects: {}, owners: {} };
  ret.bigrams = bigrams;
  for (const key in ret.owners) {
    const current = ret.owners[key];
    const strings: string[] = [];
    strings.push(current.name);
    strings.push(current.description);
    const result = BiGram.createBiGramObjectFromTexts(strings, " 　");
    for (const bigram in result) {
      if (!bigrams.owners[bigram]) {
        bigrams.owners[bigram] = [];
      }
      bigrams.owners[bigram].push(key);
    }
  }
  for (const key in ret.projects) {
    const current = ret.projects[key];
    const strings: string[] = [];
    strings.push(current.project.title);
    strings.concat(current.project.tags);
    const result = BiGram.createBiGramObjectFromTexts(strings, " 　");
    for (const bigram in result) {
      if (!bigrams.projects[bigram]) {
        bigrams.projects[bigram] = [];
      }
      bigrams.projects[bigram].push(key);
    }
  }
  console.log(ret);
  result.value = JSON.stringify(ret);
};

const copyData = () => {
  navigator.clipboard.writeText(result.value);
};
</script>

<style scoped lang="scss">
.wrapper > :not(:last-child) {
  margin-bottom: 1em;
}
</style>
