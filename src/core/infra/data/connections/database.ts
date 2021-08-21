import { Connection, createConnection } from "typeorm";

export default class Database {
  private static connection: Connection | null;

  public static getConnection(): Connection {
    if (!Database.connection) {
      throw new Error("DATABASE NOT CONNECTED");
    }
    return Database.connection;
  }

  public async openConnection(): Promise<void> {
    if (!Database.connection) {
      Database.connection = await createConnection();
      console.log("📦 DATABASE CONNECTED");
    }
  }

  public async disconnectDatabase(): Promise<void> {
    if (!Database.connection) {
      throw new Error("DATABASE NOT CONNECTED");
    }

    await Database.connection.close();
  }

  public set connection(connection: Connection | null) {
    Database.connection = connection;
  }
}
