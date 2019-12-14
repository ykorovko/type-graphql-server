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

const meQuery = `
  {
    me {
      id
      firstName
      lastName
      email
      name
    }
  }
`;

describe("Me resolver", () => {
  it("Get a user", async () => {
    const user = await User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }).save();

    const resp = await gCall({
      source: meQuery,
      userId: user.id
    });

    if (resp.errors) console.error(resp.errors[0].originalError);

    expect(resp).toMatchObject({
      data: {
        me: {
          id: `${user.id}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }
    });
  });

  it("Empty user", async () => {
    const resp = await gCall({
      source: meQuery
    });

    expect(resp).toMatchObject({
      data: {
        me: null
      }
    });
  });
});
