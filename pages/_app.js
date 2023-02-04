import "bootstrap/dist/css/bootstrap.css"; // Add this line
import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import client from "../apollo-client";
import Layout from "../components/layout/layout.tsx";

/**
 *
 * @param {Component} : Page/Component that Layout/App wrap
 * @param {pageProps} : session from Next-Auth, as well as server side props
 * @returns
 */
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <SessionProvider session={pageProps.session} store={[]}>
        <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
