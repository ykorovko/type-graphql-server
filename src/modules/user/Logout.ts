import { Resolver, Mutation, Ctx } from "type-graphql";
import MyContext from "types/MyContext";

@Resolver()
class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
    //TODO: refactor with a `promisify` util
    return new Promise((resolve, reject) => {
      ctx.req.session!.destroy(error => {
        console.error(error);

        return reject(false);
      });

      ctx.res.clearCookie("qid");

      return resolve(true);
    });
  }
}

export default LogoutResolver;
