/**
 * Fill `{placeholder}` slots in a dictionary string.
 *
 * Dictionaries have to stay serialisable (the client slice crosses the RSC
 * boundary), so interpolation is data + this helper rather than functions in
 * the dictionary itself. Unknown placeholders are left untouched, which makes a
 * typo visible in the UI instead of silently rendering "undefined".
 */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key];
    return value === undefined ? match : String(value);
  });
}
