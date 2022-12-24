import { MigrationInterface, QueryRunner } from "typeorm";

export class addedEntity1671678544814 implements MigrationInterface {
    name = 'addedEntity1671678544814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beats" DROP COLUMN "genreTags"`);
        await queryRunner.query(`ALTER TABLE "beats" ADD "genreTags" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "beats" DROP COLUMN "otherTags"`);
        await queryRunner.query(`ALTER TABLE "beats" ADD "otherTags" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beats" DROP COLUMN "otherTags"`);
        await queryRunner.query(`ALTER TABLE "beats" ADD "otherTags" character varying`);
        await queryRunner.query(`ALTER TABLE "beats" DROP COLUMN "genreTags"`);
        await queryRunner.query(`ALTER TABLE "beats" ADD "genreTags" character varying NOT NULL`);
    }

}
