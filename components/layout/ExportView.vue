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
const apiKey = ref("");
const result = ref("");

const generateParentIdRef = (data: { [key: string]: { parent: string } }) => {
  const copy = { ...data };
  interface Ret {
    childs?: { [key: string]: Ret };
    parent?: string;
  }
  const ret: Ret = {};
  const idRet: {
    [key: string]: {
      parent: string;
      childIds?: string[];
      childs?: any;
      name?: string;
      description?: string;
    };
  } = {
    ...data,
  };
  const solved: { [key: string]: string[] } = {};
  let solvedCount = 1;
  while (solvedCount) {
    solvedCount = 0;
    for (const key in copy) {
      const current = copy[key];
      const parentName = current.parent;
      if (!parentName) {
        ret[key] = current;
        solved[key] = [];
        delete copy[key];
        solvedCount++;
      } else if (parentName in solved) {
        let parent = ret;
        for (const route of solved[parentName]) {
          parent = parent[route].childs;
        }
        parent = parent[parentName];
        solved[key] = [...solved[parentName], parentName];
        if (parent.childs) {
          parent.childs[key] = current;
        } else {
          const childs = {};
          childs[key] = current;
          parent.childs = childs;
        }

        if (!idRet[key].childIds) {
          idRet[key].childIds = [];
        }
        idRet[key].childIds.push(key.substring(0, 6));
        delete copy[key];
        solvedCount++;
      }
    }
  }
  const finalIdRet = {};
  for (const key in idRet) {
    const newKey = key.substring(0, 6);
    finalIdRet[newKey] = {};
    finalIdRet[newKey].name = idRet[key].name;
    finalIdRet[newKey].description = idRet[key].description;
    finalIdRet[newKey].childIds = idRet[key].childIds;
  }
  return finalIdRet;
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
  ret.owners = generateParentIdRef(owners.value.childRef);
  const retProjects = {};
  for (const key in props.projects) {
    retProjects[key.substring(0, 6)] = props.projects[key];
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
