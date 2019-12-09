import { Field, InputType } from "type-graphql";
import { Length, IsEmail } from "class-validator";

import PasswordInput from "modules/shared/PasswordInput";
import { isEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
class RegisterInput extends PasswordInput {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @isEmailAlreadyExist({ message: "Email already in use" })
  email: string;
}

export default RegisterInput;
