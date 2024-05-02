import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1708743873566 implements MigrationInterface {
  name = 'Migration1708743873566';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "recruitSubCategory" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."recruitSubCategory" IS '프로젝트 모집 하위카테고리'`,
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
      `COMMENT ON COLUMN "project"."recruitSubCategory" IS '프로젝트 모집 하위카테고리'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "recruitSubCategory"`,
    );
  }
}
