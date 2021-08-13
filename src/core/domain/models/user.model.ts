import { Scrap } from "../../../features/scraps/domain";

export interface User {
  uid: string;
  username: string;
  password: string;
  scraps?: Scrap[];
}
