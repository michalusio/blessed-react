/** @internal */
export function getKey(tag: JSX.Component, attributes: Record<string, unknown> | undefined): string {
  const tagName = tag.name;
  if (!attributes) {
    return tagName;
  }
  if (!('key' in attributes)) {
    return tagName;
  }
  const key = attributes['key'];
  if (typeof key !== 'string' && typeof key !== 'number') {
    return tagName;
  }
  return key + '';
}