import { ScrapEntity } from "../../../../core/infra";
import { Scrap } from "../../domain";

export class ScrapRepository {
  async create(params: Scrap): Promise<Scrap> {
    const { title, description, userUid } = params;

    const scrap = await ScrapEntity.create({
      title,
      description,
      userUid,
    }).save();

    return Object.assign({} as Scrap, params, scrap);
  }

  async getAll(userUid: string): Promise<Scrap[]> {
    const scraps = await ScrapEntity.find({
      relations: ["user"],
      order: {
        createdAt: "DESC",
      },
      where: { userUid },
    });

    return scraps.map(scrap => ({
      ...scrap,
      user: scrap.user,
    }));
  }

  async getOne(uid: string, userUid: string): Promise<Scrap | null> {
    const scrap = await ScrapEntity.findOne(uid, {
      relations: ["user"],
      where: { userUid },
    });

    if (!scrap) {
      return null;
    }

    return {
      ...scrap,
      user: scrap.user,
    };
  }

  async update(uid: string, params: Scrap): Promise<Scrap | null> {
    const { title, description, userUid } = params;

    const scrap = await ScrapEntity.findOne(uid, {
      where: { userUid },
      relations: ["user"],
    });

    if (!scrap) {
      return null;
    }

    scrap.title = title;
    scrap.description = description;

    const scrapUpdated = await scrap.save();

    return {
      ...scrapUpdated,
    };
  }

  async delete(uid: string, userUid: string): Promise<null | Scrap> {
    const scrap = await ScrapEntity.findOne(uid, { where: { userUid } });

    if (!scrap) {
      return null;
    }

    return await scrap.remove();
  }
}
