import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, trim: true }) title!: string;
  @Prop({ required: true, unique: true, trim: true }) slug!: string;
  @Prop({ required: true }) content!: string;
  @Prop({ required: true, trim: true }) excerpt!: string;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ default: true }) published!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
export const PostSchema = SchemaFactory.createForClass(Post);
