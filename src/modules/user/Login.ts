import bcrypt from "bcryptjs";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";

import MyContext from "~/types/MyContext";
import User from "~/entity/Users";
import { LoginInput } from "./login/LoginInput";

@Resolver()
class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("data") { email, password }: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return null;

    if (!user.confirmed) return null;

    ctx.req.session!.userId = user.id;

    return user;
  }
}

export default LoginResolver;
