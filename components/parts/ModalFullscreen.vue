<template lang="pug">
span
  .modal-open-button(data-bs-toggle="modal", :data-bs-target="'#' + id")
    slot
  Teleport(to="body")
    .modal.fade(:id="id", area-hidden="true", tabindex="-1")
      .modal-dialog.modal-fullscreen-xl-down.modal-xl.modal-dialog-centered
        .modal-content
          .modal-header
            button.btn.btn-close(data-bs-dismiss="modal", area-label="Close")
          .modal-body.d-table
            slot(name="modal")
</template>
<script lang="ts">
import { Slugger } from "marked";
const slugger = new Slugger();
</script>
<script setup lang="ts">
const id = ref(slugger.slug("modal-fullscreen-id"));
</script>

<style scoped lang="scss">
.modal-body {
  min-height: 50vh;
}
.modal-body > :deep(*) {
  display: table-cell;
  vertical-align: middle;
}
</style>
