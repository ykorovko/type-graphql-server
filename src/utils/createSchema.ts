import { buildSchema } from "type-graphql";

import RegisterResolver from "~/modules/user/Register";
import LoginResolver from "~/modules/user/Login";
import MeResolver from "~/modules/user/Me";
import ConfirmResolver from "~/modules/user/Confirm";
import ForgotPasswordResolver from "~/modules/user/ForgotPassword";
import ChangePasswordResolver from "~/modules/user/ChangePassword";
import LogoutResolver from "~/modules/user/Logout";

const createSchema = () =>
  buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      MeResolver,
      ConfirmResolver,
      ForgotPasswordResolver,
      ChangePasswordResolver,
      LogoutResolver
    ]
  });

export default createSchema;
