import "bootstrap/dist/css/bootstrap.css"; // Add this line
import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import client from "../apollo-client";
import Layout from "../components/layout/layout.tsx";
import RoleContext from "../contexts/role";

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
          <RoleContext>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RoleContext>
        </ApolloProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
