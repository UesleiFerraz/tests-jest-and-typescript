import { Connection, createConnection } from "typeorm";

export default class Database {
  private static connection: Connection;

  public static getConnection(): Connection {
    if (!Database.connection) {
      throw new Error("DATABASE NOT CONNECTED");
    }
    return Database.connection;
  }

  public async openConnection(): Promise<void> {
    if (!Database.connection) {
      try {
        Database.connection = await createConnection();
        console.log("📦 DATABASE CONNECTED");
      } catch (error) {
        console.error(error);
      }
    }
  }

  public async disconnectDatabase(): Promise<void> {
    if (!Database.connection) {
      throw new Error("DATABASE NOT CONNECTED");
    }

    await Database.connection.close();
  }
}
