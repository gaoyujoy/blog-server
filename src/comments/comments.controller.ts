import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { IsBoolean, IsString, MinLength } from "class-validator";
import { JwtGuard } from "../auth/jwt.guard";
import { CommentsService } from "./comments.service";

class CreateCommentDto {
  @IsString() @MinLength(1) nickname!: string;
  @IsString() @MinLength(1) content!: string;
}
class VisibilityDto {
  @IsBoolean() visible!: boolean;
}

@Controller()
export class CommentsController {
  constructor(private readonly service: CommentsService) {}
  @Get("posts/:postId/comments") visible(@Param("postId") postId: string) {
    return this.service.findVisible(postId);
  }
  @Post("posts/:postId/comments") create(
    @Param("postId") postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.service.create(postId, dto.nickname, dto.content);
  }
  @Get("comments") @UseGuards(JwtGuard) all() {
    return this.service.findAll();
  }
  @Patch("comments/:id") @UseGuards(JwtGuard) visibleToggle(
    @Param("id") id: string,
    @Body() dto: VisibilityDto,
  ) {
    return this.service.setVisible(id, dto.visible);
  }
  @Delete("comments/:id") @UseGuards(JwtGuard) remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
