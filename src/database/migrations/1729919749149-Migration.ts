import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1729919749149 implements MigrationInterface {
  name = 'Migration1729919749149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "isDeleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."isDeleted" IS '삭제 여부'`,
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
      `COMMENT ON COLUMN "profile"."isDeleted" IS '삭제 여부'`,
    );
    await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "isDeleted"`);
  }
}
