import { User } from "../../../../core/domain/";

export interface Scrap {
  uid: string;
  title: string;
  description: string;
  userUid: string;
  user: User;
}
