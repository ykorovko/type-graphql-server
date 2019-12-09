import { Resolver, Mutation, Arg } from "type-graphql";
import { v4 } from "uuid";

import User from "@entity/Users";
import Mail from "@services/Mail";

import redis from "redis";
import { forgotPasswordPrefix } from "constants/redisPrefixes";

@Resolver()
class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) return true;

    const token = v4();

    await redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24); // 1 day expiration

    const url = `http://localhost:3000/user/change-password/${token}`;

    Mail.sendMail({
      to: email,
      subject: "Reset your password",
      html: `
        <div>
          <p>We've received a request to reset your password. If you didn't make the request, just ignore this email.</p>
          <p>Otherwise, you can reset your password using this link.</p>
          <a href="${url}">${url}</a>
        </div>
      `
    });

    return true;
  }
}

export default ForgotPasswordResolver;
