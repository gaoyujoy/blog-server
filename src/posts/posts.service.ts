import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post } from "./post.schema";

type PostInput = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags?: string[];
  published?: boolean;
};

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private readonly model: Model<Post>) {}

  async findAll(query: {
    keyword?: string;
    page?: number;
    limit?: number;
    tag?: string;
    admin?: boolean;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(30, Math.max(1, Number(query.limit) || 8));
    const filter: Record<string, unknown> = query.admin
      ? {}
      : { published: true };
    if (query.keyword)
      filter.$or = [
        { title: { $regex: query.keyword, $options: "i" } },
        { content: { $regex: query.keyword, $options: "i" } },
      ];
    if (query.tag) filter.tags = query.tag;
    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.model.countDocuments(filter),
    ]);
    return { items, total, page, limit, hasMore: page * limit < total };
  }

  findBySlug(slug: string) {
    return this.model.findOne({ slug, published: true }).lean();
  }
  async findById(id: string) {
    const item = await this.model.findById(id).lean();
    if (!item) throw new NotFoundException("文章不存在");
    return item;
  }
  create(input: PostInput) {
    return this.model.create({ ...input, tags: input.tags || [] });
  }
  async update(id: string, input: PostInput) {
    const item = await this.model
      .findByIdAndUpdate(id, input, { new: true })
      .lean();
    if (!item) throw new NotFoundException("文章不存在");
    return item;
  }
  async remove(id: string) {
    await this.model.findByIdAndDelete(id);
    return { ok: true };
  }
}
