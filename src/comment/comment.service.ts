import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entity/comment.entity';
import { IsNull, Repository, In, Not } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ProjectService } from 'src/project/project.service';
import { v4 as uuid } from 'uuid';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotificationsService } from 'src/notification/notification.service';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private readonly projectService: ProjectService,
    private readonly notificationService: NotificationsService,
  ) {}

  async create(data: CreateCommentDto, userId: string) {
    const id = uuid();

    const {
      projectId,
      content,
      parentCommentId,
      referenceUserId,
      referenceName,
    } = data;

    const comment = new Comment();

    // NOTE: 댓글을 달려고 하는 프로젝트 존재 여부 확인 및 nickname과 jobType 가져오기
    const { nickname, jobType, profileImageUrl, projectUserId } =
      await this.projectService.getforCreateComment(projectId, userId);

    // NOTE: 알림 추가
    await this.notificationService.create({
      userId: projectUserId,
      message: '프로젝트에 댓글이 달렸습니다.',
      projectId,
    });

    // NOTE: 대댓글인 경우
    if (parentCommentId) {
      const parentComment = await this.commentRepository.findOne({
        where: {
          id: parentCommentId,
        },
      });

      comment.parentComment = parentComment;
      comment.parentCommentId = parentCommentId;
    }

    // NOTE: 태그 댓글인 경우
    if (referenceUserId) {
      comment.referenceUserId = referenceUserId;
      comment.referenceName = referenceName;

      // NOTE: 알림 추가
      await this.notificationService.create({
        userId: referenceUserId,
        message: '대댓글이 달렸습니다.',
        projectId,
      });
    }

    comment.id = id;
    comment.projectId = projectId;
    comment.userId = userId;
    comment.content = content;
    comment.jobType = jobType;
    comment.nickname = nickname;
    comment.profileImageUrl = profileImageUrl;

    const result = await this.commentRepository.save(comment);

    return {
      id: result.id,
      createdAt: result.createdAt,
      userId: result.userId,
      nickname,
      jobType: jobType,
      profileImageUrl,
      content: result.content,
      isUpdate: false,
      isDelete: false,
      parentCommentId: parentCommentId,
      referenceUserId: referenceUserId,
      referenceName: referenceName,
    };
  }

  async update(data: UpdateCommentDto, userId: string, commentId: string) {
    const { projectId, content } = data;

    // NOTE: 댓글을 달려고 하는 프로젝트 존재 여부 확인 및 nickname과 jobType 가져오기
    const { nickname, jobType, profileImageUrl } =
      await this.projectService.getforCreateComment(projectId, userId);

    await this.commentRepository.update(commentId, {
      content,
      isUpdate: true,
      nickname,
      jobType,
      profileImageUrl,
    });

    const result = await this.commentRepository.findOneBy({ id: commentId });

    return {
      id: result.id,
      createdAt: result.createdAt,
      isUpdate: true,
      isDelete: false,
      userId: result.userId,
      nickname,
      jobType: jobType,
      profileImageUrl,
      content: result.content,
      parentCommentId: result.parentCommentId,
      referenceUserId: result.referenceUserId,
      referenceName: result.referenceName,
    };
  }

  async delete(deleteUserId: string, commentId: string) {
    const now = new Date();

    // NOTE: 자신이 단 댓글인지 확인
    const data = await this.commentRepository.findOne({
      where: {
        id: commentId,
        deletedAt: IsNull(),
      },
    });

    if (!data) {
      throw new HttpException(
        '이미 삭제되거나 존재하지 않는 댓글입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (deleteUserId !== data.userId) {
      throw new HttpException(
        '권한이 없어 이 댓글을 삭제할 수 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    // NOTE: 삭제된 것처럼 update
    await this.commentRepository.update(commentId, {
      isDelete: true,
    });

    return {
      result: true,
    };
  }

  async getComments(projectId: string) {
    // 모든 댓글을 단일 쿼리로 가져옵니다.
    const comments = await this.commentRepository.find({
      where: {
        projectId,
        parentCommentId: IsNull(),
      },
      relations: ['replies'],
      order: {
        createdAt: 'ASC',
      },
    });

    const result = comments.map((data) => {
      const replies = data.replies.map((reply) => {
        if (reply.isDelete) {
          return {
            ...reply,
            content: '삭제된 댓글입니다.',
          };
        } else return reply;
      });

      if (data.isDelete) {
        return {
          ...data,
          replies,
          content: '삭제된 댓글입니다.',
        };
      } else
        return {
          ...data,
          replies,
        };
    });

    return result;
  }
}
