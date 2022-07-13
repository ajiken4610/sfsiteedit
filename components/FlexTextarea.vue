<template lang="pug">
.flex-textarea
  .flex-textarea__dummy(aria-hidden="true") {{ modelValue + "\u200b" }}
  textarea.flex-textarea__textarea.form-control(
      @input="updateValue"
      :value="modelValue"
      :placeholder="$props.placeholder")
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string;
  placeholder?: string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
function updateValue(event: Event) {
  emit("update:modelValue", (event.currentTarget as HTMLTextAreaElement).value);
}
</script>

<style scoped lang="scss">
.flex-textarea {
  position: relative;
  font-size: 1rem;
  line-height: 1.8;
}
.flex-textarea__dummy {
  overflow: hidden;
  visibility: hidden;
  padding: 5px 15px;
  min-height: 5em;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.flex-textarea__textarea {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  overflow: hidden;
  padding: 5px 15px;
  width: 100%;
  height: 100%;
  background-color: transparent;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  resize: none;
}
</style>
