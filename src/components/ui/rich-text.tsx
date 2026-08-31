import { Fragment } from "react";
import type { Rich } from "@/lib/i18n/dictionaries";

/**
 * Renders a dictionary `Rich` array — plain strings plus `{ em }` segments that
 * get the "lifted out of the muted body copy" treatment. Keeping emphasis as
 * data means translators move the highlight with the sentence instead of
 * re-deriving JSX per locale.
 */
export function RichText({ value }: { value: Rich }) {
  return (
    <>
      {value.map((node, index) =>
        typeof node === "string" ? (
          <Fragment key={index}>{node}</Fragment>
        ) : (
          <span key={index} className="text-bone">
            {node.em}
          </span>
        ),
      )}
    </>
  );
}
