import "dotenv/config";
import IORedis from "ioredis";

export class Redis {
  static #connection: IORedis.Redis;

  public static getConnection(): IORedis.Redis {
    if (!this.#connection) {
      Redis.prototype.openConnection();
    }
    return this.#connection;
  }

  public openConnection(): void {
    if (!Redis.#connection) {
      Redis.#connection = new IORedis(process.env.REDIS_URL);
    }
  }
}
