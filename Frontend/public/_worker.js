// Cloudflare Pages Worker for SPA routing
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // List of file extensions to skip
    const staticExtensions = [
      '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
      '.ico', '.pdf', '.woff', '.woff2', '.ttf', '.eot', '.json', '.map'
    ];

    // Check if the request is for a static file
    const isStaticFile = staticExtensions.some(ext => pathname.endsWith(ext)) ||
                        pathname.startsWith('/assets/');

    // For static files, let Cloudflare handle them normally
    if (isStaticFile) {
      return env.ASSETS.fetch(request);
    }

    // For everything else (routes), serve index.html
    const indexResponse = await env.ASSETS.fetch(new Request(new URL('/index.html', url)));
    return new Response(indexResponse.body, {
      status: 200,
      headers: indexResponse.headers,
    });
  },
};
