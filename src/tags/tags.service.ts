import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Tag } from "./tag.schema";

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private readonly model: Model<Tag>) {}
  findAll() {
    return this.model.find().sort({ name: 1 }).lean();
  }
  async create(name: string) {
    try {
      return await this.model.create({ name: name.trim() });
    } catch {
      throw new ConflictException("标签已存在");
    }
  }
  async update(id: string, name: string) {
    const item = await this.model.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true },
    );
    if (!item) throw new NotFoundException("标签不存在");
    return item;
  }
  async remove(id: string) {
    await this.model.findByIdAndDelete(id);
    return { ok: true };
  }
}
