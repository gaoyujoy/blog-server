import { Body, Controller, Delete, Get, Param, Post as HttpPost, Put, Query, UseGuards } from '@nestjs/common';
import { IsArray, IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { JwtGuard } from '../auth/jwt.guard';
import { PostsService } from './posts.service';

class PostDto {
  @IsString() @MinLength(1) title!: string;
  @IsString() @MinLength(1) slug!: string;
  @IsString() content!: string;
  @IsString() excerpt!: string;
  @IsArray() @IsString({ each: true }) @IsOptional() tags?: string[];
  @IsBoolean() @IsOptional() published?: boolean;
}

@Controller('posts')
export class PostsController {
  constructor(private readonly service: PostsService) {}
  @Get() list(@Query() query: { keyword?: string; page?: number; limit?: number; tag?: string }) { return this.service.findAll(query); }
  @Get('admin/all') @UseGuards(JwtGuard) adminList(@Query() query: { keyword?: string; page?: number; limit?: number; tag?: string }) { return this.service.findAll({ ...query, admin: true }); }
  @Get('slug/:slug') detail(@Param('slug') slug: string) { return this.service.findBySlug(slug); }
  @Get(':id') @UseGuards(JwtGuard) byId(@Param('id') id: string) { return this.service.findById(id); }
  @UseGuards(JwtGuard) @HttpPost() create(@Body() dto: PostDto) { return this.service.create(dto); }
  @UseGuards(JwtGuard) @Put(':id') update(@Param('id') id: string, @Body() dto: PostDto) { return this.service.update(id, dto); }
  @UseGuards(JwtGuard) @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
