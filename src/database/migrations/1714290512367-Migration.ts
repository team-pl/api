import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1714290512367 implements MigrationInterface {
  name = 'Migration1714290512367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "apply" ADD "profileImageUrl" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "apply"."profileImageUrl" IS '지원한 사용자 프로필사진 url'`,
    );
    await queryRunner.query(
      `ALTER TABLE "apply" ADD "nickname" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "apply"."nickname" IS '지원한 사용자 닉네임(별명)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "apply" ADD "jobType" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "apply"."jobType" IS '지원한 사용자 직업 종류'`,
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
      `COMMENT ON COLUMN "apply"."jobType" IS '지원한 사용자 직업 종류'`,
    );
    await queryRunner.query(`ALTER TABLE "apply" DROP COLUMN "jobType"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "apply"."nickname" IS '지원한 사용자 닉네임(별명)'`,
    );
    await queryRunner.query(`ALTER TABLE "apply" DROP COLUMN "nickname"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "apply"."profileImageUrl" IS '지원한 사용자 프로필사진 url'`,
    );
    await queryRunner.query(
      `ALTER TABLE "apply" DROP COLUMN "profileImageUrl"`,
    );
  }
}
