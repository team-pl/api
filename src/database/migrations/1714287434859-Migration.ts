import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1714287434859 implements MigrationInterface {
  name = 'Migration1714287434859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "projectName" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "notification"."projectName" IS '알림 관련 프로젝트 이름(제목)'`,
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
      `COMMENT ON COLUMN "notification"."projectName" IS '알림 관련 프로젝트 이름(제목)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "projectName"`,
    );
  }
}
