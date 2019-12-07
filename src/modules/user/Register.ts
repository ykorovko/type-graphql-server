import bcrypt from "bcryptjs";
import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";

import User from "@entity/Users";
import isAuth from "@middleware/isAuth";

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

    return user;
  }
}

export default RegisterResolver;
