import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment } from "./comment.schema";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly model: Model<Comment>,
  ) {}
  findVisible(postId: string) {
    return this.model
      .find({ postId, visible: true })
      .sort({ createdAt: 1 })
      .lean();
  }
  findAll() {
    return this.model
      .find()
      .populate("postId", "title slug")
      .sort({ createdAt: -1 })
      .lean();
  }
  create(postId: string, nickname: string, content: string) {
    return this.model.create({ postId, nickname, content, visible: true });
  }
  async setVisible(id: string, visible: boolean) {
    const item = await this.model
      .findByIdAndUpdate(id, { visible }, { new: true })
      .lean();
    if (!item) throw new NotFoundException("评论不存在");
    return item;
  }
  async remove(id: string) {
    await this.model.findByIdAndDelete(id);
    return { ok: true };
  }
}
