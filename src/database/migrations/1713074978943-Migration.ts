import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1713074978943 implements MigrationInterface {
  name = 'Migration1713074978943';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" character varying NOT NULL, "projectId" character varying, "message" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id")); COMMENT ON COLUMN "notification"."id" IS 'id'; COMMENT ON COLUMN "notification"."createdAt" IS '알림 등록일'; COMMENT ON COLUMN "notification"."updatedAt" IS '알림 수정일'; COMMENT ON COLUMN "notification"."deletedAt" IS '알림 삭제일'; COMMENT ON COLUMN "notification"."userId" IS '알림 대상 사용자 ID'; COMMENT ON COLUMN "notification"."projectId" IS '알림 관련 프로젝트 ID'; COMMENT ON COLUMN "notification"."message" IS '알림 내용'; COMMENT ON COLUMN "notification"."isRead" IS '알림 읽음 여부'`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "jobType" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "comment"."jobType" IS '사용자 직업 종류'`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "nickname" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "comment"."nickname" IS '사용자 닉네임(별명)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "profileImageUrl" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "comment"."profileImageUrl" IS '사용자 프로필사진 url'`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "isUpdate" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "comment"."isUpdate" IS '댓글 수정 여부'`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "isDelete" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "comment"."isDelete" IS '댓글 삭제 여부'`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "referenceUserId" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "comment"."referenceUserId" IS '대댓글 등록시 태그한 사용자 ID'`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "referenceName" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "comment"."referenceName" IS '대댓글 등록시 태그한 사용자 이름'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "comment"."referenceName" IS '대댓글 등록시 태그한 사용자 이름'`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP COLUMN "referenceName"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "comment"."referenceUserId" IS '대댓글 등록시 태그한 사용자 ID'`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP COLUMN "referenceUserId"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "comment"."isDelete" IS '댓글 삭제 여부'`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "isDelete"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "comment"."isUpdate" IS '댓글 수정 여부'`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "isUpdate"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "comment"."profileImageUrl" IS '사용자 프로필사진 url'`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP COLUMN "profileImageUrl"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "comment"."nickname" IS '사용자 닉네임(별명)'`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "nickname"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "comment"."jobType" IS '사용자 직업 종류'`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "jobType"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
