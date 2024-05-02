import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1707832291875 implements MigrationInterface {
  name = 'Migration1707832291875';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "recruitCategory"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "recruitCategory" character varying array NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."recruitCategory" IS '프로젝트 모집 카테고리'`,
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
      `COMMENT ON COLUMN "project"."recruitCategory" IS '프로젝트 모집 카테고리'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "recruitCategory"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "recruitCategory" character varying NOT NULL`,
    );
  }
}
