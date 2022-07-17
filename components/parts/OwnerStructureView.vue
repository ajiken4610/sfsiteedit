<template lang="pug">
template(v-for="(value, key) in structure")
  .ms-2(
    data-bs-toggle="collapse",
    :data-bs-target="'#owner-structure-' + key",
    :class="{ 'dropdown-toggle': value.childs, 'd-inline': !value.childs }"
  )
    NuxtLink(:to="'/owner/' + key") {{ value.name }}
  .collapse.show.border-start.ms-2(
    v-if="value.childs",
    :id="'owner-structure-' + key"
  )
    OwnerStructureView(:structure="value.childs")
</template>

<script setup lang="ts">
defineProps<{
  structure: {
    [key: string]: { childs: {}; name: string; description: string };
  };
}>();
</script>
