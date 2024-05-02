import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1707313048977 implements MigrationInterface {
  name = 'Migration1707313048977';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "state" character varying NOT NULL DEFAULT 'RECRUITING'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."state" IS '프로젝트 모집 상태'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "confirmedNumber" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."confirmedNumber" IS '프로젝트 확정인원'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "recruitEtcTotalNumber" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."recruitEtcTotalNumber" IS '프로젝트 기타 모집인원'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "recruitCategory" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."recruitCategory" IS '프로젝트 모집 카테고리'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "userName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."userName" IS '프로젝트 모집글을 작성한 사용자 이름'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "numberOfScore" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."numberOfScore" IS '프로젝트 인기 score'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "nickname" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "nickname" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "jobType" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."jobType" IS '직업 종류'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "jobType" DROP DEFAULT`,
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
      `ALTER TABLE "user" ALTER COLUMN "jobType" SET DEFAULT 'ENGINEER'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."jobType" IS '직업 종류(엔지니어/디자이너)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "jobType" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "nickname" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "nickname" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."numberOfScore" IS '프로젝트 인기 score'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "numberOfScore"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."userName" IS '프로젝트 모집글을 작성한 사용자 이름'`,
    );
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "userName"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."recruitCategory" IS '프로젝트 모집 카테고리'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "recruitCategory"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."recruitEtcTotalNumber" IS '프로젝트 기타 모집인원'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "recruitEtcTotalNumber"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."confirmedNumber" IS '프로젝트 확정인원'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "confirmedNumber"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."state" IS '프로젝트 모집 상태'`,
    );
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "state"`);
  }
}
