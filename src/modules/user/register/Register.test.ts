import { Connection } from "typeorm";
import faker from "faker";

import createTestConnection from "~/tests/createTestConnection";
import gCall from "~/utils/gCall";
import User from "~/entity/Users";

let connection: Connection;

beforeAll(async () => {
  connection = await createTestConnection();
});

afterAll(async () => {
  await connection.close();
});

const registerMutation = `
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      id
      firstName
      lastName
      email
      name
    }
  }
`;

describe("Register resolver", () => {
  it.only("Create a user", async () => {
    const data = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    const resp = await gCall({
      source: registerMutation,
      variableValues: {
        data
      }
    });

    if (resp.errors) console.error(resp.errors[0].originalError);

    expect(resp).toMatchObject({
      data: {
        register: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        }
      }
    });

    const user = await User.findOne({ where: { email: data.email } });

    expect(user).toBeDefined();
    expect(user!.confirmed).toBeFalsy();
  });
});
