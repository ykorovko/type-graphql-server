import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";
import User from "@entity/Users";

import ChangePasswordInput from "./changePassword/ChangePasswordInput";
import { forgotPasswordPrefix } from "constants/redisPrefixes";
import redis from "redis";
import MyContext from "types/MyContext";

@Resolver()
class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const forgotPasswordToken = forgotPasswordPrefix + token;

    const userId = await redis.get(forgotPasswordToken);

    if (!userId) return null;

    const user = await User.findOne(userId);

    if (!user) return null;

    await redis.del(forgotPasswordToken);

    user.password = await bcrypt.hash(password, 12);
    await user.save();

    ctx.req.session!.userId = user.id;

    return user;
  }
}

export default ChangePasswordResolver;
