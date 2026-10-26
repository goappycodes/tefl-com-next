"use client";

/**
 * An external <script async src> a template prints in the content area,
 * deferred like the passthrough render (WpScripts loads it in document order).
 *
 * React hoists any `<script async src>` into <head> as a resource unless it
 * has an onLoad/onError handler, so it gets a no-op one and stays where the
 * template prints it (handlers aren't rendered as attributes).
 */
const noop = () => undefined;

export default function AsyncScript({ src }: { src: string }) {
  return <script type="text/tefl-deferred" src={src} async onLoad={noop} />;
}
