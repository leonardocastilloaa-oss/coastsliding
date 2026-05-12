export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/robots.txt") {
      const body = [
        "# CoastSlide / Coastsliding valid robots.txt",
        "# Served cleanly by Cloudflare Pages",
        "User-agent: *",
        "Allow: /",
        "",
        "Sitemap: https://coastsliding.com/sitemap.xml",
        ""
      ].join("\n");

      return new Response(body, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
        }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
