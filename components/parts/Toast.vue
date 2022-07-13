<template lang="pug">
.toast.m-3(ref="toast")
  .toast-header(v-if="title")
    strong.me-auto {{title}}
    small {{subtitle}}
    button.btn-close(data-bs-dismiss="toast")
  .toast-body {{body}}

</template>

<script setup lang="ts">
import { Toast } from "bootstrap";
const props = defineProps<{
  title?: string;
  subtitle?: string;
  body: string;
  showing?: boolean;
}>();
const toast = ref<HTMLElement>();
let toastInstance: Toast;
onMounted(() => {
  toastInstance = new Toast(toast.value, { autohide: false, animation: false });
});
watch(
  () => props.showing,
  () => {
    if (props.showing) {
      toastInstance.show();
    } else {
      toastInstance.hide();
    }
  }
);
</script>
