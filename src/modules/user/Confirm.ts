import { Mutation, Arg, Resolver } from "type-graphql";

import User from "~/entity/Users";
import redis from "~/redis";
import { confirmUserPrefix } from "~/constants/redisPrefixes";

@Resolver()
class ConfirmResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    const confirmUserToken = confirmUserPrefix + token;

    const userId = await redis.get(confirmUserToken);

    if (!userId) return false;

    await User.update({ id: parseInt(userId, 10) }, { confirmed: true });

    await redis.del(confirmUserToken);

    return true;
  }
}

export default ConfirmResolver;
