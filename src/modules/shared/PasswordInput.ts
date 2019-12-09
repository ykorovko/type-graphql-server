import { InputType, Field } from "type-graphql";
import { MinLength } from "class-validator";

@InputType()
class PasswordInput {
  @Field()
  @MinLength(5)
  password: string;
}

export default PasswordInput;
