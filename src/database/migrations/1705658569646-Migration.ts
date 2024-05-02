import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1705658569646 implements MigrationInterface {
  name = 'Migration1705658569646';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "userId" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "project"."userId" IS '프로젝트 모집자의 ID (user_entity.id)'`,
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
      `COMMENT ON COLUMN "project"."userId" IS '프로젝트 모집자의 ID (user_entity.id)'`,
    );
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "userId"`);
  }
}
