import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ProjectService } from 'src/project/project.service';
import { v4 as uuid } from 'uuid';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private readonly projectService: ProjectService,
  ) {}

  async create(data: CreateCommentDto, userId: string) {
    const id = uuid();

    const { projectId, content, parentCommentId } = data;

    const comment = new Comment();

    // NOTE: 댓글을 달려고 하는 프로젝트 존재 여부 확인 및 nickname과 jobType 가져오기
    const { name, jobType } = await this.projectService.getforCreateComment(
      projectId,
      userId,
    );

    // NOTE: 대댓글인 경우
    if (parentCommentId) {
      const parentComment = await this.commentRepository.findOneBy({
        id: parentCommentId,
        deletedAt: IsNull(),
      });

      // NOTE: 위의 댓글이 없는 경우
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }
      comment.parentComment = parentComment;
    }

    comment.id = id;
    comment.projectId = projectId;
    comment.userId = userId;
    comment.content = content;

    const result = await this.commentRepository.save(comment);

    return {
      id: result.id,
      createdAt: result.createdAt,
      userId: result.userId,
      name: name,
      jobType: jobType,
      content: result.content,
    };
  }

  async update(data: UpdateCommentDto, userId: string, commentId: string) {
    const { projectId, content } = data;

    // NOTE: 댓글을 달려고 하는 프로젝트 존재 여부 확인 및 nickname과 jobType 가져오기
    const { name, jobType } = await this.projectService.getforCreateComment(
      projectId,
      userId,
    );

    await this.commentRepository.update(commentId, {
      content,
    });

    const result = await this.commentRepository.findOneBy({ id: commentId });

    return {
      id: result.id,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      userId: result.userId,
      name: name,
      jobType: jobType,
      content: result.content,
    };
  }
}
