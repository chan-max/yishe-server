import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository, } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';


@Injectable()
export class CommentService {

  constructor(@InjectRepository(Comment)
  private commentRepo) {

  }


  async addComment({
    relationId,
    parentId,
    content,
    userId
  }) {
    var origin = await this.commentRepo.findOne({
      relationId
    });

    if (!origin) {
      origin = await this.commentRepo.create({
        relationId
      })
    }

    if (!origin.meta) {
      origin.meta = {}
    }

    if (!origin.meta.comments) {
      origin.meta.comments = []
    }

    origin.meta.comments.push({
      parentId,
      content,
      userId
    })

    return await this.commentRepo.save(origin)
  }

  async getCommnet({
    relationId
  }) {

  }

  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
