import Cors from "micro-cors";
import { ApolloServer } from "apollo-server-micro";
import typeDefs from "../../db/schema";
import resolvers from "../../db/resolvers/index";
import connectDb from "../../db/config";

connectDb();

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "OPTIONS"],
});

const server = new ApolloServer({
  // context: createContext,
  // schema,
  typeDefs,
  resolvers,
  context: () => {
    return {};
  },
  engine: {
    reportSchema: true,
  },
  playground: {
    settings: {
      "editor.theme": "dark",
      "request.credentials": "include",
    },
  },
});

const startServer = server.start();

export default cors(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
});
