import "reflect-metadata";
import Express from "express";
import { ApolloServer } from "apollo-server-express";
import {
  createConnection,
  getConnectionOptions,
  ConnectionOptions
} from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

import redis from "./redis";
import createSchema from "./utils/createSchema";

const main = async () => {
  try {
    const connectionOptions: ConnectionOptions = await getConnectionOptions(
      process.env.NODE_ENV
    );

    await createConnection(connectionOptions);
  } catch (error) {
    console.error(error);
  }

  try {
    const schema = await createSchema();

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }: any) => ({ req, res })
    });

    const app = Express();

    const RedisStore = connectRedis(session);

    app.use(
      cors({
        credentials: true,
        origin: "http://localhost:3000"
      })
    );

    app.use(
      session({
        store: new RedisStore({ client: redis as any }),
        name: "qid",
        secret: "123456",
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
        }
      })
    );

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
      console.log("Server started on http://localhost:4000/graphql");
    });
  } catch (error) {
    console.error(error);
  }
};

main();
