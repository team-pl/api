import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1706619347869 implements MigrationInterface {
  name = 'Migration1706619347869';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "profile"`);
    await queryRunner.query(
      `ALTER TABLE "project" ADD "recruitDevTotalNumber" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."recruitDevTotalNumber" IS '프로젝트 개발자 모집인원'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "recruitDesignTotalNumber" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."recruitDesignTotalNumber" IS '프로젝트 디자이너 모집인원'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "numberOfViews" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."numberOfViews" IS '프로젝트 조회수'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "numberOfLikes" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."numberOfLikes" IS '프로젝트 좋아요수'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "profileId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."profileId" IS '프로젝트 모집자가 선택한 프로필 ID'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."profileId" IS '프로젝트 모집자가 선택한 프로필 ID'`,
    );
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "profileId"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."numberOfLikes" IS '프로젝트 좋아요수'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "numberOfLikes"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."numberOfViews" IS '프로젝트 조회수'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "numberOfViews"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."recruitDesignTotalNumber" IS '프로젝트 디자이너 모집인원'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "recruitDesignTotalNumber"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."recruitDevTotalNumber" IS '프로젝트 개발자 모집인원'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "recruitDevTotalNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "profile" character varying NOT NULL DEFAULT ''`,
    );
  }
}
