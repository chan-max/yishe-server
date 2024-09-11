import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { OptionalAuthGuard } from 'src/common/authGuard'



@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }


  @Post('addComment')
  @UseGuards(OptionalAuthGuard)
  addComment(@Body() body, @Req() req) {
    let { relationId, parentId, content } = body
    let { userId } = req.user
    this.commentService.addComment({
      relationId,
      parentId,
      content,
      userId
    })
  }

  @Post('addComment')
  getComment(@Body() body) {
    // let { relationId, parentId, content } = body
    // // this.commentService.getComment({
    // //   relationId,
    // //   parentId,
    // //   content,
    // // })
  }


  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
