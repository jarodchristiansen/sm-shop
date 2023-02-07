import NextAuth, { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import User from "../../../db/models/user";
import CredentialsProvider from "next-auth/providers/credentials";

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      id: "pizza-sho-credentails",
      name: "Role Resolver for session/pages",
      async authorize(credentials, req) {
        try {
          const user = await User.findOne({
            email: "jarodchristiansendevelopment@gmail.com",
          });

          if (user) {
            return user;
          }
        } catch (err) {
          return err;
        }
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token }) {
      // token.userRole = "admin";
      return token;
    },
    async session({ session, token, user }) {
      session.user.username = user.username;
      session.user.favorites = user.favorites;
      session.user.role = user.role; // Add role value to user object so it is passed along with session

      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      let userEmail = user?.email;

      // let existingUser = await User.findOne({ email: userEmail });

      // if (existingUser) {
      //   if (!existingUser?.username) {
      //     let newId = makeid(12).toString() + "!@$";
      //     existingUser.username = newId;
      //     await existingUser.save();
      //   }
      // } else if (!existingUser) {
      //   return;
      // }

      return user;
    },
  },
  secret: "PLACE-HERE-ANY-STRING",
  pages: {
    signIn: "/auth",
  },
};

export default NextAuth(authOptions);
