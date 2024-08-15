import User, { IUser } from "../schema/User";
import { AbstractService } from "./abstractService";

export class UserService extends AbstractService<IUser> {
  constructor() {
    super(User);
  }
}
