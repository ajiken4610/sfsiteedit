<template lang="pug">
div
  Head(v-if="!pending")
    Title {{ project.title }}
    Meta(
      v-if="project.thumbnail",
      name="thumbnail",
      :content="project.thumbnail"
    )
    Meta(
      v-if="project.description",
      name="description",
      :content="project.description"
    )
  .display-1.text-center(v-if="pending || pendingOwners") Loading...
  .project-wrapper(v-else)
    LayoutProjectView(:project="project")
</template>

<script setup lang="ts">
const project = computed(() => toStrictProject(data.value?.project));

const route = useRoute();

const { pending, data } = useProjectData(
  route.params.id.toString(),
  !(route.query.submitted === "true")
);
const { pending: pendingOwners } = await useOwnersData();
</script>

<style scoped lang="scss">
.horizontal-card-wrapper > * {
  max-width: 24rem;
}
.horizontal-card-wrapper > :not(:last-child) {
  margin-bottom: 1.5rem;
}
</style>
