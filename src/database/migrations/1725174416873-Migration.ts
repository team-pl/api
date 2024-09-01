import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1725174416873 implements MigrationInterface {
  name = 'Migration1725174416873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" RENAME COLUMN "eduCategory1" TO "type"`,
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
      `ALTER TABLE "notification" RENAME COLUMN "type" TO "eduCategory1"`,
    );
  }
}
