import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1709040734833 implements MigrationInterface {
  name = 'Migration1709040734833';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "projectId" character varying NOT NULL, "userId" character varying NOT NULL, "name" character varying NOT NULL, "jobType" character varying, "content" character varying NOT NULL, "parentCommentId" character varying, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id")); COMMENT ON COLUMN "comment"."id" IS 'id'; COMMENT ON COLUMN "comment"."createdAt" IS '댓글 작성일'; COMMENT ON COLUMN "comment"."updatedAt" IS '댓글 수정일'; COMMENT ON COLUMN "comment"."deletedAt" IS '댓글 삭제일'; COMMENT ON COLUMN "comment"."projectId" IS '댓글을 남긴 프로젝트 ID'; COMMENT ON COLUMN "comment"."userId" IS '댓글을 작성한 사용자 ID'; COMMENT ON COLUMN "comment"."name" IS '댓글을 남긴 사용자 nickname'; COMMENT ON COLUMN "comment"."jobType" IS '댓글을 남긴 사용자 직업 종류'; COMMENT ON COLUMN "comment"."content" IS '댓글 내용'; COMMENT ON COLUMN "comment"."parentCommentId" IS 'id'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_73aac6035a70c5f0313c939f237" FOREIGN KEY ("parentCommentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_73aac6035a70c5f0313c939f237"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET DEFAULT ''`,
    );
    await queryRunner.query(`DROP TABLE "comment"`);
  }
}
