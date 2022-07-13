export default function (id: string, big?: boolean) {
  return `https://img.youtube.com/vi/${id}/${big ? "0" : "default"}.jpg`;
}
