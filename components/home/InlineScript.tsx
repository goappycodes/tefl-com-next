"use client";

/**
 * An async external <script> kept where the template prints it.
 *
 * React (Next's canary build) hoists `<script async src>` into <head> unless
 * it has a load handler, which would move it out of the content slot. The
 * no-op onLoad keeps it in place, so it loads during HTML parse exactly as on
 * live. Only for self-contained scripts (no jQuery or theme dependencies),
 * e.g. the Trustpilot widget bootstrap.
 */
export default function InlineScript({ src, type }: { src: string; type?: string }) {
  return <script type={type} src={src} async onLoad={noop} />;
}

function noop() {}
