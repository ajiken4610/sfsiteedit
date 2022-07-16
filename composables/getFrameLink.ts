import { StrictSFProject } from "./SFProject";

export default (project: StrictSFProject) => {
  let ret = "";
  switch (project.type) {
    case "youtube":
      ret = `https://youtube.com/embed/${project.id}?rel=0`;
      break;
    case "drive":
      ret = `https://drive.google.com/file/d/${project.id}/preview`;
      break;
    case "drive-raw":
      ret = `https://drive.google.com/uc?id=${project.id}`;
      break;
    case "github":
      ret =
        "project:text/html;base64," +
        Buffer.from(
          `\u003c\u0073\u0063\u0072\u0069\u0070\u0074\u003ewindow.addEventListener("load",function(){var as = document.getElementsByTagName('a');for (var i = 0; i < as.length; i++) {as[i].setAttribute('target', '_blank');}})\u003c\u002f\u0073\u0063\u0072\u0069\u0070\u0074\u003e\u003c\u0073\u0063\u0072\u0069\u0070\u0074\u0020\u0073\u0072\u0063\u003d\u0022https://gist-it.appspot.com/github/${project.id}\u0022\u003e\u003c\u002f\u0073\u0063\u0072\u0069\u0070\u0074\u003e`
        ).toString("base64");
      break;
    case "gist":
      ret =
        "project:text/html;base64," +
        Buffer.from(
          `\u003c\u0073\u0063\u0072\u0069\u0070\u0074\u003ewindow.addEventListener("load",function(){var as = document.getElementsByTagName('a');for (var i = 0; i < as.length; i++) {as[i].setAttribute('target', '_blank');}})\u003c\u002f\u0073\u0063\u0072\u0069\u0070\u0074\u003e\u003c\u0073\u0063\u0072\u0069\u0070\u0074\u0020\u0073\u0072\u0063\u003d\u0022https://gist.github.com/${project.id}.js\u0022\u003e\u003c\u002f\u0073\u0063\u0072\u0069\u0070\u0074\u003e`
        ).toString("base64");
      break;
    case "iframe":
      ret = project.id || "";
      break;
  }
  return ret;
};
