import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1705737603017 implements MigrationInterface {
  name = 'Migration1705737603017';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id")); COMMENT ON COLUMN "file"."id" IS 'id'; COMMENT ON COLUMN "file"."createdAt" IS '파일 업로드일'; COMMENT ON COLUMN "file"."updatedAt" IS '파일 수정일'; COMMENT ON COLUMN "file"."deletedAt" IS '파일 삭제일'; COMMENT ON COLUMN "file"."userId" IS '파일을 업로드한 사용자 ID'; COMMENT ON COLUMN "file"."url" IS '파일 url'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET DEFAULT ''`,
    );
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
