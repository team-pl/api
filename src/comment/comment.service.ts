import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ProjectService } from 'src/project/project.service';
import { v4 as uuid } from 'uuid';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private readonly projectService: ProjectService,
    private readonly emailService: EmailService,
  ) {}

  async create(data: CreateCommentDto, userId: string) {
    const id = uuid();

    const { projectId, content, parentCommentId } = data;

    const comment = new Comment();

    // NOTE: 댓글을 달려고 하는 프로젝트 존재 여부 확인 및 nickname과 jobType 가져오기
    const { name, projectUserName, jobType, projectUserEmail, projectName } =
      await this.projectService.getforCreateComment(projectId, userId);

    // NOTE: 대댓글인 경우
    if (parentCommentId) {
      const parentComment = await this.commentRepository.findOne({
        where: {
          id: parentCommentId,
          deletedAt: IsNull(),
        },
        relations: ['user'],
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

    // NOTE: 프로젝트 등록한 사람에게 이메일 알림 보내기
    await this.emailService.sendCommentCreateMail(
      projectUserEmail,
      '[팀+] 프로젝트에 대한 댓글이 달렸습니다.',
      {
        name: projectUserName,
        projectName: projectName,
      },
    );

    // NOTE: 대댓글인 경우 댓글을 작성한 사용자에게도 알려주기
    if (parentCommentId) {
      await this.emailService.sendCommentReplyMail(
        comment.parentComment.user.email,
        '[팀+] 댓글에 대한 대댓글이 달렸습니다.',
        {
          name: comment.parentComment.user.nickname,
        },
      );
    }

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

  async delete(deleteUserId: string, commentId: string) {
    const now = new Date();

    // NOTE: 자신이 단 댓글인지 확인
    const { userId } = await this.commentRepository.findOneBy({
      id: commentId,
    });

    if (deleteUserId !== userId) {
      throw new HttpException(
        '권한이 없어 이 댓글을 삭제할 수 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    // NOTE: deletedAt 컬럼에 값 추가하여 조회 안되도록 함
    await this.commentRepository.update(commentId, {
      deletedAt: now,
    });

    return {
      result: true,
    };
  }
}
