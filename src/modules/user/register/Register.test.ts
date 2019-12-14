import { Connection } from "typeorm";
import createTestConnection from "~/tests/createTestConnection";
import gCall from "~/utils/gCall";

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

describe("Registration", () => {
  it("Create a user", async () => {
    await gCall({
      source: registerMutation,
      variableValues: {
        data: {
          firstName: "Yura",
          lastName: "Super",
          email: "yurasuper@test.com",
          password: "12345678"
        }
      }
    });
  });
});
