import {
  getConnectionOptions,
  createConnection,
  ConnectionOptions
} from "typeorm";

const createTestConnection = async (drop: boolean = false) => {
  const options: ConnectionOptions = await getConnectionOptions("test");

  return createConnection({
    ...options,
    synchronize: drop,
    dropSchema: drop
  });
};

export default createTestConnection;
