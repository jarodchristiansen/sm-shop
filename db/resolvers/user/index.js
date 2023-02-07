import User from "../../models/user";

export const UserResolver = {
  queries: {
    getUser: async (_, { email, id }) => {
      let user;

      if (id) {
        user = await User.find({ username: id })
          .then((res) => res[0].toObject())
          .catch((err) => err);
      } else if (email) {
        user = User.find({ email })
          .then((res) => res[0].toObject())
          .catch((err) => err);
      }

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    },
  },
  mutations: {},
};
