import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1715497549579 implements MigrationInterface {
  name = 'Migration1715497549579';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "like" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" character varying NOT NULL, "projectId" character varying NOT NULL, CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id")); COMMENT ON COLUMN "like"."id" IS 'id'; COMMENT ON COLUMN "like"."createdAt" IS '클릭일'; COMMENT ON COLUMN "like"."updatedAt" IS '수정일'; COMMENT ON COLUMN "like"."deletedAt" IS '클릭 해지일'; COMMENT ON COLUMN "like"."userId" IS '좋아요를 누른 사용자 ID (user_entity.id)'; COMMENT ON COLUMN "like"."projectId" IS '좋아요를 누른 프로젝트 ID (project_entity.id)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET DEFAULT ''`,
    );
    await queryRunner.query(`DROP TABLE "like"`);
  }
}
