import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1714281494879 implements MigrationInterface {
  name = 'Migration1714281494879';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "apply" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "projectId" character varying NOT NULL, "userId" character varying NOT NULL, "profileId" character varying NOT NULL, "state" character varying NOT NULL DEFAULT 'UNCONFIRMED', "details" character varying NOT NULL, CONSTRAINT "PK_c61ed680472aa0f58499175d902" PRIMARY KEY ("id")); COMMENT ON COLUMN "apply"."id" IS 'id'; COMMENT ON COLUMN "apply"."createdAt" IS '지원 등록일'; COMMENT ON COLUMN "apply"."updatedAt" IS '지원 수정일'; COMMENT ON COLUMN "apply"."deletedAt" IS '지원 삭제일'; COMMENT ON COLUMN "apply"."projectId" IS '지원한 프로젝트 ID'; COMMENT ON COLUMN "apply"."userId" IS '지원한 사용자 ID'; COMMENT ON COLUMN "apply"."profileId" IS '지원한 프로필 ID'; COMMENT ON COLUMN "apply"."state" IS '지원 상태'; COMMENT ON COLUMN "apply"."details" IS '지원 내용'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "applicantTotalNumber" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."applicantTotalNumber" IS '프로젝트 총 지원인원'`,
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
      `COMMENT ON COLUMN "project"."applicantTotalNumber" IS '프로젝트 총 지원인원'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "applicantTotalNumber"`,
    );
    await queryRunner.query(`DROP TABLE "apply"`);
  }
}
