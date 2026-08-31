/**
 * `view-transition-name` values shared by the project card (list) and the case
 * study header (detail). Both sides must produce the *same* string for the
 * browser to morph one element into the other instead of cross-fading them.
 *
 * Slugs come from velite's `s.slug()`, so they are already `[a-z0-9-]+` — safe
 * to drop into a CSS custom-ident. The prefix guarantees the ident never starts
 * with a digit, which would be invalid.
 *
 * Names must also be unique per document: one card per slug on the list page,
 * one header per slug on the detail page. A duplicate makes the browser skip
 * the whole transition.
 */

export function projectCoverName(slug: string): string {
  return `project-cover-${slug}`;
}

export function projectTitleName(slug: string): string {
  return `project-title-${slug}`;
}
