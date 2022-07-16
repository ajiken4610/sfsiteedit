import { Slugger, marked } from "marked";
import hljs from "highlight.js";
import sanitizeHtml from "sanitize-html";

let rootSlugger = new Slugger();
let modalIdSlugger = new Slugger();

const renderer = new marked.Renderer();

renderer.table = (header, body) => {
  if (body) body = `<tbody>${body}</tbody>`;

  return `<div class="table-responsive"><table class="table"><thead>${header}</thead>${body}</table></div>`;
};
const escapeTest = /[&<>"']/;
const escapeReplace = /[&<>"']/g;
const escapeReplacements = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const getEscapeReplacement = (ch: string) =>
  ch === "&" || ch === "<" || ch === ">" || ch === "'" || ch === '"'
    ? escapeReplacements[ch]
    : ch;
function escape(html: string) {
  if (escapeTest.test(html)) {
    return html.replace(escapeReplace, getEscapeReplacement);
  }

  return html;
}

const markedOptions = {
  renderer,
  breaks: true,
  langPrefix: "",
  highlight: function (code: string, lang: string) {
    return hljs.highlightAuto(code, [lang]).value;
  },
};

const sanitizeHtmlOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "del",
    "button",
    "iframe",
    "iframe-hidden",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    ...{
      h1: ["id"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      h5: ["id"],
      h6: ["id"],
      "*": ["data-bs-toggle", "data-bs-target"],
      iframe: ["src", "allowfullscreen", "allow"],
      "iframe-hidden": ["src", "allowfullscreen", "allow"],
    },
  },
  allowedClasses: {
    "*": ["hljs-*"],
    table: ["table"],
    div: ["*"],
    a: ["*"],
    button: ["*"],
    img: ["youtube-thumbnail"],
  },
  allowedIframeHostnames: ["youtube.com"],
};

let initialized = false;

function parsePlaneMarkdown(src: string) {
  if (!initialized) {
    useRouter().afterEach(() => {
      rootSlugger = new Slugger();
      modalIdSlugger = new Slugger();
    });
    initialized = true;
  }

  const slugger = new Slugger();
  const modalId = ref(modalIdSlugger.slug("modal-fullscreen-id"));
  const modalIdInnerSlugger = new Slugger();
  const modalIdValue: { [key: string]: string } = {};

  renderer.code = (code, language, isEscaped) => {
    let ret;
    if (
      language === "button" ||
      language === "button-modal" ||
      language === "youtube"
    ) {
      if (!isEscaped) {
        code = escape(code);
      }
    }
    const splitted = code.split("\n");
    let modalIdInnerSlug: string;
    switch (language) {
      case "button":
        ret = `<a${
          splitted[1] ? ` href="${splitted[1]}"` : ""
        } class="btn btn-primary mb-2">${splitted[0] ?? ""}</a>`;
        break;
      case "button-modal":
        modalIdInnerSlug = modalIdInnerSlugger.slug(modalId.value);
        const buttonValue = splitted.shift();
        modalIdValue[modalIdInnerSlug] = splitted.join("\n");
        ret = `<button class="btn btn-primary mb-2" data-bs-toggle="modal" data-bs-target="#${modalIdInnerSlug}">${buttonValue}</button>`;
        break;
      case "youtube":
        modalIdInnerSlug = modalIdInnerSlugger.slug(modalId.value);
        const youtubeId = splitted[0];
        modalIdValue[
          modalIdInnerSlug
        ] = `<div class="youtube-frame"><div><div class="display-1">Loading...</div></div><iframe-hidden src="https://youtube.com/embed/${youtubeId}?enablejsapi=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        ret = `<div class="youtube-thumbnail-wrapper"><img class="youtube-thumbnail" data-bs-toggle="modal" data-bs-target="#${modalIdInnerSlug}" src="${getYoutubeThumbnailUrl(
          youtubeId,
          true
        )}"></div>`;
        break;
      default:
        ret = marked.Renderer.prototype.code.call(
          renderer,
          code,
          language,
          isEscaped
        );
    }
    return ret;
  };
  renderer.heading = (text, level, raw) => {
    const escapedText = text.toLowerCase().replace(/"+/g, "-");
    const id = rootSlugger.slug(slugger.slug(escapedText));
    return `<h${level} id="${id}"><a href="#${id}">${text}</a></h${level}>`;
  };
  return {
    result: sanitizeHtml(marked.parse(src, markedOptions), sanitizeHtmlOptions),
    modalIdValue,
  };
}

function parseMarkdownRecursively(
  src: { result: string; modalIdValue: { [key: string]: string } },
  ret: { [key: string]: string }[]
) {
  ret.push(src.modalIdValue);
  if (Object.keys(src.modalIdValue).length) {
    // 中身あるなら再帰
    for (const current in src.modalIdValue) {
      src.modalIdValue[current] = parseMarkdownRecursively(
        parsePlaneMarkdown(src.modalIdValue[current]),
        ret
      );
    }
  }
  return src.result;
}

function parseMarkdown(src: string): {
  result: string;
  modalIdValue: { [key: string]: string }[];
} {
  const ret: { [key: string]: string }[] = [];
  return {
    result: parseMarkdownRecursively(parsePlaneMarkdown(src), ret),
    modalIdValue: ret,
  };
}
export default parseMarkdown;
