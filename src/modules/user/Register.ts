import bcrypt from "bcryptjs";
import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";

import User from "@entity/Users";
import isAuth from "@middleware/isAuth";
import Mail from "@services/Mail";

import { createConfirmationUrl } from "utils/functions";
import { RegisterInput } from "./register/RegisterInput";

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

    const url = await createConfirmationUrl(user.id);

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
