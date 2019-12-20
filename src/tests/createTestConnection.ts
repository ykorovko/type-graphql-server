import {
  getConnectionOptions,
  createConnection,
  ConnectionOptions
} from "typeorm";

const createTestConnection = async (drop: boolean = false) => {
  // Read connection options from ormconfig file (or ENV variables)
  const {
    name,
    ...connectionOptions
  }: ConnectionOptions = await getConnectionOptions("test");

  // Overriding options defined in ormconfig
  Object.assign(connectionOptions, { synchronize: drop, dropSchema: drop });

  return createConnection(connectionOptions);
};

export default createTestConnection;
