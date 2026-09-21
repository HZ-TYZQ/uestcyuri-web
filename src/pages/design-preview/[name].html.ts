import type { APIRoute, GetStaticPaths } from 'astro';

// Use a URL distinct from the root-level source folder: Astro's dev route
// guard blocks browser navigation to URLs that match root-level HTML files.
const demos = import.meta.glob<string>('../../../design-demos/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export const getStaticPaths = (() =>
  Object.entries(demos).map(([path, html]) => ({
    params: { name: path.split('/').pop()!.replace(/\.html$/, '') },
    props: { html },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(props.html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
