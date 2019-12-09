import { Mutation, Arg, Resolver } from "type-graphql";

import User from "@entity/Users";
import redis from "../../redis";

@Resolver()
class ConfirmResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    const userId = await redis.get(token);

    if (!userId) return false;

    await User.update({ id: parseInt(userId, 10) }, { confirmed: true });

    await redis.del(token);

    return true;
  }
}

export default ConfirmResolver;
