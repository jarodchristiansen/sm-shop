import User from "../../models/user";

export const UserResolver = {
  queries: {
    getUser: async (_, { email, id }) => {
      // Searches for user profile based on id for profile page, needs update
      let user;

      if (id) {
        user = await User.find({ username: id })
          .then((res) => res[0].toObject())
          .catch((err) => console.log("IN GETUSER", { err }));
      } else if (email) {
        user = User.find({ email })
          .then((res) => res[0].toObject())
          .catch((err) => console.log("IN GETUSER", { err }));
      }

      if (user?.favorites) {
        for (let i of user.favorites) {
          i.id = user.favorites.indexOf(i);
        }
      }

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    },
  },
  mutations: {
    updateUsername: async (_, { input }) => {
      const { username, email } = input;

      try {
        let user = await User.findOne({ email });

        let inputMatch = await User.findOne({ username: username });

        inputMatch && new Error("User name already exists");

        if (user && !inputMatch) {
          user.username = username;
          await user.save();
          return user;
        }
      } catch (err) {
        console.log("Error in updating username!", { err });
      }
    },
  },
};