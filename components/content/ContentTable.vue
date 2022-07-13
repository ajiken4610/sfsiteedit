<template lang="pug">
.table-responsive
  table.table
    Markdown(:use="$slots.default" unwrap="table")
</template>
