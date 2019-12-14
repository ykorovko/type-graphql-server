import { Field, InputType } from "type-graphql";
import PasswordInput from "~/modules/shared/PasswordInput";

@InputType()
class ChangePasswordInput extends PasswordInput {
  @Field()
  token: string;
}

export default ChangePasswordInput;
