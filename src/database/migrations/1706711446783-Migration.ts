import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1706711446783 implements MigrationInterface {
  name = 'Migration1706711446783';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile" RENAME COLUMN "프로필 id" TO "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" RENAME CONSTRAINT "PK_40037ca3ef7d2d24d5d54876dfd" TO "PK_3dd8bfc97e4a77c70971591bdcb"`,
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
      `ALTER TABLE "profile" RENAME CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" TO "PK_40037ca3ef7d2d24d5d54876dfd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" RENAME COLUMN "id" TO "프로필 id"`,
    );
  }
}
