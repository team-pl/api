import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1706094754289 implements MigrationInterface {
  name = 'Migration1706094754289';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" ADD "usage" character varying NOT NULL DEFAULT 'PROJECT'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "file"."usage" IS '파일 업로드 용도'`,
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
      `COMMENT ON COLUMN "file"."usage" IS '파일 업로드 용도'`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "usage"`);
  }
}
