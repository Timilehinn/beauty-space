export function returnServiceImagesAsString(images) {
  if (
    Array.isArray(images) &&
    images.length > 0 &&
    typeof images[0] === 'object' &&
    'url' in images[0]
  ) {
    return images.map((obj) => obj.url)
  } else if (
    Array.isArray(images) &&
    images.every((item) => typeof item === 'string')
  ) {
    return images
  } else {
    return []
  }
}
