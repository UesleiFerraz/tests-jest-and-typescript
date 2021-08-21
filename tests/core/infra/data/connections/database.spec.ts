import Database from "../../../../../src/core/infra/data/connections/database";
import { Connection } from "typeorm";

const makeSut = (): Database => new Database();

describe("database", () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    await makeSut().connection?.close();
  });

  describe("getConnection", () => {
    it("Should throw an error if the connection is not open", async () => {
      try {
        Database.getConnection();
      } catch (error: any) {
        expect(error.message).toBe("DATABASE NOT CONNECTED");
      }
    });

    it("Should return the connection if it is open", async () => {
      await makeSut().openConnection();
      const result = Database.getConnection();

      expect(result).toBeInstanceOf(Connection);
    });
  });

  describe("disconnectDatabase", () => {
    it("Should disconnect the connection if it is open", async () => {
      const sut = makeSut();
      await sut.openConnection();
      await sut.disconnectDatabase();

      expect(sut.connection).toBeFalsy();
    });

    it("Should throw an error if the connection is not open", async () => {
      makeSut().connection = null;

      try {
        await makeSut().disconnectDatabase();
      } catch (error: any) {
        expect(error.message).toBe("DATABASE NOT CONNECTED");
      }
    });
  });
});
