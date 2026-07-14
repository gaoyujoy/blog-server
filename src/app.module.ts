import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtGuard } from './auth/jwt.guard';
import { TagsController } from './tags/tags.controller';
import { TagsService } from './tags/tags.service';
import { Tag, TagSchema } from './tags/tag.schema';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { Post, PostSchema } from './posts/post.schema';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { Comment, CommentSchema } from './comments/comment.schema';
import { RssController } from './rss.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'coder-blog-local-secret', signOptions: { expiresIn: '7d' } }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coder-blog'),
    MongooseModule.forFeature([
      { name: Tag.name, schema: TagSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [AuthController, TagsController, PostsController, CommentsController, RssController],
  providers: [AuthService, JwtGuard, TagsService, PostsService, CommentsService],
})
export class AppModule {}
