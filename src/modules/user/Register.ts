import bcrypt from "bcryptjs";
import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import { v4 } from "uuid";

import User from "~/entity/Users";
import isAuth from "~/middleware/isAuth";
import Mail from "~/services/Mail";

import redis from "~/redis";
import { confirmUserPrefix } from "~/constants/redisPrefixes";
import RegisterInput from "./register/RegisterInput";

@Resolver()
class RegisterResolver {
  @UseMiddleware(isAuth)
  @Query(() => String)
  async hello() {
    return "Hello world!!!";
  }

  @Mutation(() => User)
  async register(
    @Arg("data")
    { firstName, lastName, email, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();

    const token = v4();

    await redis.set(confirmUserPrefix + token, user.id, "ex", 60 * 60 * 24); // 1 day expiration

    const url = `http://localhost:3000/user/confirm/${token}`;

    Mail.sendMail({
      to: email,
      subject: "Thank you for registration! 👻",
      html: `
        <div>
          <p>
            For added security, please verify your email address to confirm that this account belongs to you by clicking
          </p>
          <a href="${url}">${url}</a>
        </div>
      `
    });

    return user;
  }
}

export default RegisterResolver;
