import fetch from "cross-fetch";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const configBaseURL = () => {
  if (process.env.BASE_URL === "http://localhost:3000") {
    return "http://localhost:3000/api/graphql";
  } else {
    return "https://sm-pizza-shop.vercel.app/api/graphql";
  }
};

const client = new ApolloClient({
  dataIdFromObject: (o) => o.id,
  link: new HttpLink({
    uri: configBaseURL(),
    fetch,
  }),
  cache: new InMemoryCache(),
});

export default client;
