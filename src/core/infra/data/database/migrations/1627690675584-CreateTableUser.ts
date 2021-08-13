import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableUser1627690675584 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "uid",
            type: "uuid",
            isPrimary: true,
            isNullable: false,
            isUnique: true,
          },
          {
            name: "username",
            type: "varchar",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            isNullable: false,
            default: "NOW()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            isNullable: false,
            default: "NOW()",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users", true, true, true);
  }
}
