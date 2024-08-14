export function getImageUrl(name: string, path: string) {
  return new URL(`../assets/icons/${path}/${name}`, import.meta.url).href;
}
