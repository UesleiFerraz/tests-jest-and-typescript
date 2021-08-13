import { UserEntity } from "../../../../core/infra";
import { User } from "../../domain";

export class UserRepository {
  async create(params: User): Promise<Omit<User, "password">> {
    const { username, password } = params;

    const user = await UserEntity.create({
      username,
      password,
    }).save();

    return {
      uid: user.uid,
      username,
    };
  }

  async getAll(): Promise<Omit<User, "password">[]> {
    const users = await UserEntity.find({ relations: ["scraps"] });

    return users.map(user => ({
      uid: user.uid,
      username: user.username,
      scraps: user.scraps,
    }));
  }

  async getOne(username: string): Promise<User | null> {
    const user = await UserEntity.findOne({
      where: {
        username,
      },
      relations: ["scraps"],
    });

    if (!user) {
      return null;
    }

    return {
      uid: user.uid,
      username: user.username,
      password: user.password,
      scraps: user.scraps,
    };
  }

  async update(params: User): Promise<Omit<User, "password"> | null> {
    const { uid, username, password } = params;

    const user = await UserEntity.findOne(uid);

    if (!user) {
      return null;
    }

    user.username = username;
    user.password = password;

    await user.save();

    return {
      uid: user.uid,
      username,
    };
  }

  async delete(uid: string): Promise<void> {
    const user = await UserEntity.findOne(uid);

    if (!user) {
      return;
    }

    await user.remove();
  }
}
