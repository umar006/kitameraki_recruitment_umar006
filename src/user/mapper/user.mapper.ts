import { User, UserDocument } from '../schema/user.schema';

export class UserMapper {
  static toDomain(raw: UserDocument): User {
    const user = new User();

    user.email = raw.email;
    user.password = raw.password;

    return user;
  }
}
