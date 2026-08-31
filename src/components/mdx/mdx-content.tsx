"use client";
/* eslint-disable react-hooks/static-components -- MDX is compiled from a string at runtime; it cannot be a static module-level component. */

import { useMemo } from "react";
import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "./mdx-components";

type MDXComponentProps = { components?: typeof mdxComponents };

/** Runs velite's compiled MDX (a function body expecting the jsx runtime). */
function getMDXComponent(code: string): React.ComponentType<MDXComponentProps> {
  const fn = new Function(code);
  return fn({ ...runtime }).default as React.ComponentType<MDXComponentProps>;
}

export function MDXContent({ code }: { code: string }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return <Component components={mdxComponents} />;
}
