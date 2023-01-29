/**
 * return the full url of the asset
 * @param path asset path
 */
export function getAssetsUrl(path: string) {
  return new URL(`/src/assets/${path}`, import.meta.url).href
}
