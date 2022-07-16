<template lang="pug">
div(v-for="current in showList")
  .ms-2(v-if="current.isChild")
    PartsTableOfContents(
      :table="current.child",
      :prefix="(prefix || '') + current.index + '.'"
    )
  a(v-else, :href="'#' + current.id")
    .dropdown-item.text-truncate(
      v-html="(prefix ? prefix : '') + (current.index + 1) + '. ' + current.name"
    )
</template>
<script setup lang="ts">
import { TableOfContents } from "~/composables/parseMarkdown";
const props = defineProps<{ table: TableOfContents[]; prefix?: string }>();

const showList = computed(() => {
  if (props.table.length > 0) {
    const ret: (
      | {
          isChild: true;
          child: TableOfContents[];
          index: number;
          name?: string;
          id?: string;
        }
      | { isChild: false; index: number; name: string; id: string }
    )[] = [];
    const thisLevel = props.table[0].level;
    let child: TableOfContents[] | null = null;
    let index = 0;
    for (const current of props.table) {
      if (current.level > thisLevel) {
        if (!child) {
          child = [];
        }
        child.push(current);
      } else {
        if (child) {
          ret.push({ isChild: true, child, index: index });
          ret.push({
            isChild: false,
            name: current.name,
            index: index++,
            id: current.id,
          });
          child = null;
        } else {
          ret.push({
            isChild: false,
            name: current.name,
            index: index++,
            id: current.id,
          });
        }
      }
    }
    if (child) {
      ret.push({ isChild: true, child, index: index });
    }
    return ret;
  } else {
    return [];
  }
});
</script>
