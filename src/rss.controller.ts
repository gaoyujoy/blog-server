import { Controller, Get, Header } from "@nestjs/common";
import { PostsService } from "./posts/posts.service";

const escapeXml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

@Controller()
export class RssController {
  constructor(private readonly postsService: PostsService) {}

  @Get("rss.xml")
  @Header("Content-Type", "application/rss+xml; charset=utf-8")
  async feed() {
    const baseUrl = (
      process.env.SITE_URL ||
      process.env.FRONTEND_URL ||
      "http://localhost:5173"
    ).replace(/\/$/, "");
    const { items } = await this.postsService.findAll({ page: 1, limit: 20 });
    const entries = items
      .map((post) => {
        const link = `${baseUrl}/posts/${encodeURIComponent(post.slug)}`;
        return `<item><title>${escapeXml(post.title)}</title><link>${escapeXml(link)}</link><guid isPermaLink="true">${escapeXml(link)}</guid><description>${escapeXml(post.excerpt)}</description><pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>${post.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join("") || ""}</item>`;
      })
      .join("");

    return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>gaoyu.dev</title><link>${escapeXml(baseUrl)}/</link><description>高宇的代码与技术记录</description><language>zh-CN</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${entries}</channel></rss>`;
  }
}
