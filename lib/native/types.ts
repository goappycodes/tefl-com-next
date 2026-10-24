import type { ReactNode } from "react";

import type { RenderedPage } from "../render";

/**
 * A theme template ported to React (phase 2). See docs/NATIVE-TEMPLATES.md.
 *
 * `match` reads the page's body classes — WordPress has already chosen the PHP
 * template for this URL, and its body class says which (`single-<type>`,
 * `page-template-<file>`, `tibr-active`, `blog`, `search`…). The data comes
 * from `tefl/v1/native/<endpoint>` (wordpress/headless/native/<endpoint>.php).
 */
export interface NativeTemplate<T = unknown> {
  /** Route name of the data endpoint: tefl/v1/native/<endpoint>. */
  endpoint: string;
  match: (classes: Set<string>, page: RenderedPage) => boolean;
  /** <script id>s of theme scripts the React template takes over (dropped from the shell). */
  replaces?: string[];
  render: (data: T) => ReactNode;
}

/** Typed entry for the registry: `template<MyData>({ … })`. */
export function template<T>(t: NativeTemplate<T>): NativeTemplate<unknown> {
  return t as NativeTemplate<unknown>;
}
