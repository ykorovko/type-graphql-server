import { Resolver, Query, Ctx } from "type-graphql";
import User from "@entity/Users";
import MyContext from "types/MyContext";

@Resolver()
class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    const userId = ctx.req.session!.userId;

    if (!userId) return undefined;

    return User.findOne(userId);
  }
}

export default MeResolver;
