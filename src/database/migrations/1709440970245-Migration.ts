import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1709440970245 implements MigrationInterface {
  name = 'Migration1709440970245';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "isTemporaryStorage" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."isTemporaryStorage" IS '임시저장 여부'`,
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
      `COMMENT ON COLUMN "profile"."isTemporaryStorage" IS '임시저장 여부'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "isTemporaryStorage"`,
    );
  }
}
