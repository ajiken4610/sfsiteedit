<template lang="pug">
.markdown-viewer-wrapper
  .table-of-contents(v-if="tableOfContents.length")
    button.dropdown.dropdown-toggle.button.float-end.btn.btn-outline-light(
      data-bs-toggle="dropdown"
    ) 目次
    .dropdown-menu.dropdown-menu-end
      PartsTableOfContents(:table="tableOfContents")
  .markdown-viewer(v-html="parsedHtml")
  Teleport(to="body")
    template(v-for="currentModalIdValue in modalIdValue")
      .markdown-viewer-modal.modal.fade(
        v-for="(value, modalKey) in currentModalIdValue",
        :id="modalKey.toString()",
        area-hidden="true",
        tabindex="-1"
      )
        .modal-dialog.modal-xl.modal-dialog-centered
          .modal-content
            .modal-header
              button.btn.btn-close(data-bs-dismiss="modal", area-label="Close")
            .modal-body.d-table(v-html="value")
</template>

<script lang="ts">
// デリゲートでaタグのクリックイベント
document.addEventListener(
  "click",
  (e) => {
    let el = e.target as HTMLElement;
    while (el && !el.matches("body")) {
      if (el.matches(".markdown-viewer a[href]")) {
        e.preventDefault();
        const href = el.getAttribute("href") || "";
        if (href.match(/^https?:\/\/.*$/g)) {
          window.open(href);
        } else if (href.match(/^#.*$/g)) {
          location.hash = href.substring(1);
        } else {
          useRouter().push(href);
        }
        break;
      }
      el = el.parentNode as HTMLElement;
    }
  },
  false
);
const replaceTagName = (target: Element, tagName: string): Element => {
  if (!target.parentNode) {
    return target;
  }

  const replacement = document.createElement(tagName);
  Array.from(target.attributes).forEach((attribute) => {
    const { nodeName, nodeValue } = attribute;
    if (nodeValue) {
      replacement.setAttribute(nodeName, nodeValue);
    }
  });
  Array.from(target.childNodes).forEach((node) => {
    replacement.appendChild(node);
  }); // For some reason, only textNodes are appended
  // without converting childNodes to Array.
  target.parentNode.replaceChild(replacement, target);
  return replacement;
};
document.addEventListener(
  "hidden.bs.modal",
  (e) => {
    let el = e.target as HTMLElement;
    while (el && !el.matches("body")) {
      if (el.matches(".markdown-viewer-modal.modal")) {
        el.querySelectorAll(".youtube-frame iframe").forEach((element) => {
          if (element instanceof HTMLIFrameElement) {
            // element.contentWindow?.postMessage(
            //   '{"event":"command", "func":"pauseVideo", "args":null}',
            //   "*"
            // );
            replaceTagName(element, "iframe-hidden");
          }
        });
        break;
      }
      el = el.parentNode as HTMLElement;
    }
  },
  false
);

document.addEventListener(
  "show.bs.modal",
  (e) => {
    let el = e.target as HTMLElement;
    while (el && !el.matches("body")) {
      if (el.matches(".markdown-viewer-modal.modal")) {
        el.querySelectorAll(".youtube-frame iframe-hidden").forEach(
          (element) => {
            // element.contentWindow?.postMessage(
            //   '{"event":"command", "func":"pauseVideo", "args":null}',
            //   "*"
            // );
            replaceTagName(element, "iframe");
          }
        );
        break;
      }
      el = el.parentNode as HTMLElement;
    }
  },
  false
);
</script>

<script setup lang="ts">
import { TableOfContents } from "~/composables/parseMarkdown";
const props = defineProps<{ src: string }>();

const fullWidth = ref(992 > window.innerWidth);
const onResize = () => {
  fullWidth.value = 992 > window.innerWidth;
};
window.addEventListener("resize", onResize);
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const parsed: { [key: string]: string } = {};

const modalIdValue = ref<{ [key: string]: string }[]>([{}]);
const tableOfContents = ref<TableOfContents[]>([]);

const parsedHtml = computed(() => {
  const src = props.src;
  if (src in parsed) {
    return parsed[src];
  } else {
    const {
      result,
      modalIdValue: newModalIdValue,
      tableOfContents: newTableOfContents,
    } = parseMarkdown(src);
    modalIdValue.value = newModalIdValue;
    tableOfContents.value = newTableOfContents;
    return (parsed[src] = result);
  }
});

onMounted(() => {
  document
    .getElementById(decodeURIComponent(location.hash.substring(1)))
    ?.scrollIntoView(true);
});
</script>

<style scoped lang="scss">
.table-of-contents .dropdown-menu {
  max-width: 100vw;
}

.modal-dialog {
  width: calc(100vw - 1rem);
  max-width: calc(177vh - 20rem);
}
.modal:not(.show) iframe {
  display: none;
}
.markdown-viewer:deep(pre) {
  background-color: #111;
  padding: 1rem;
  border-radius: 5px;
}
.markdown-viewer:deep(.youtube-thumbnail-wrapper > img) {
  display: block;
  width: 100%;
  margin: auto;
  border-radius: 5px;
  object-fit: cover;
}
.markdown-viewer:deep(img) {
  display: block;
  width: v-bind("fullWidth?'100%':'75%'");
  margin: 1rem auto;
  border-radius: 5px;
  object-fit: cover;
}

.markdown-viewer:deep(img.youtube-thumbnail) {
  aspect-ratio: 16/9;
  margin: 1rem auto;
}
.markdown-viewer:deep(.drive-frame) {
  width: 100%;
  position: relative;
  margin: 1rem auto;
}
.modal-body:deep(.youtube-frame) {
  display: table-cell;
  vertical-align: middle;
  position: relative;
}
.modal-body:deep(.youtube-frame > iframe) {
  aspect-ratio: 16/9;
}
.markdown-viewer:deep(.drive-frame > iframe) {
  aspect-ratio: 1/1;
  max-height: 90vh;
}
.modal-body:deep(.youtube-frame > iframe),
.markdown-viewer:deep(.drive-frame > iframe) {
  z-index: 1065;
  position: relative;

  width: 100%;
  border-radius: 5px;
}
.modal-body:deep(.youtube-frame > div),
.markdown-viewer:deep(.drive-frame > div) {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  display: table;
}
.modal-body:deep(.youtube-frame > div > div),
.markdown-viewer:deep(.drive-frame > div > div) {
  display: table-cell;
  vertical-align: middle;
}
.markdown-viewer:deep(div.youtube-thumbnail-wrapper) {
  position: relative;
  display: table;
  width: v-bind("fullWidth?'100%':'75%'");
  margin: auto;
}
.markdown-viewer:deep(div.youtube-thumbnail-wrapper)::after {
  position: absolute;
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%) rotate(90deg) scale(2);
  z-index: 2;
  visibility: visible;
  content: "▲";
  background-color: rgba(17, 17, 17, 0.5);
  pointer-events: none;
  border-radius: 25%;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.6rem;
  padding-bottom: 0.7rem;
  transition: background-color 0.2s;
}
.markdown-viewer:deep(div.youtube-thumbnail-wrapper):hover::after {
  background-color: #d80000;
}
.markdown-viewer:deep(blockquote) {
  border-left: 0.25rem solid #888;
  padding-left: 1rem;
  color: #ddd;
  border-radius: 5px;
  background-color: rgba(17, 17, 17, 0.5);
}
.markdown-viewer:deep(:not(pre) > code) {
  color: #58ffb4;
  background-color: #2e2e2e;
  border-radius: 5px;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  font-weight: bolder;
}
</style>
