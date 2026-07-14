import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ type: Types.ObjectId, ref: "Post", required: true })
  postId!: Types.ObjectId;
  @Prop({ required: true, trim: true }) nickname!: string;
  @Prop({ required: true, trim: true }) content!: string;
  @Prop({ default: true }) visible!: boolean;
  createdAt!: Date;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.set("timestamps", { createdAt: true, updatedAt: false });
