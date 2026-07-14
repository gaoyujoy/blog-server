import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { JwtGuard } from '../auth/jwt.guard';
import { TagsService } from './tags.service';

class TagDto { @IsString() @MinLength(1) name!: string; }

@Controller('tags')
export class TagsController {
  constructor(private readonly service: TagsService) {}
  @Get() findAll() { return this.service.findAll(); }
  @UseGuards(JwtGuard) @Post() create(@Body() dto: TagDto) { return this.service.create(dto.name); }
  @UseGuards(JwtGuard) @Put(':id') update(@Param('id') id: string, @Body() dto: TagDto) { return this.service.update(id, dto.name); }
  @UseGuards(JwtGuard) @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
