import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1725171568580 implements MigrationInterface {
  name = 'Migration1725171568580';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "eduCategory1" character varying NOT NULL DEFAULT 'PROJECT'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "notification"."eduCategory1" IS '알림 종류(PROJECT/COMMENT/APPLY/DEADLINE)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "targetPage" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "notification"."targetPage" IS '알림 클릭시 이동할 페이지(dashboard/project)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "dashboardState" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "notification"."dashboardState" IS '대시보드 이동시 프로젝트 상태'`,
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
      `COMMENT ON COLUMN "notification"."dashboardState" IS '대시보드 이동시 프로젝트 상태'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "dashboardState"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "notification"."targetPage" IS '알림 클릭시 이동할 페이지(dashboard/project)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "targetPage"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "notification"."eduCategory1" IS '알림 종류(PROJECT/COMMENT/APPLY/DEADLINE)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "eduCategory1"`,
    );
  }
}
