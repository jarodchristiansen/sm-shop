import cookieCutter from "cookie-cutter";

/**
 *
 * @param identity: Name of cache identity to store values under
 * @param values: Items being stored/role
 */
export const StoreLocalKeys = (identity, values) => {
  cookieCutter.set(identity, values, {
    path: "/",
    maxAge: 2592000,
    sameSite: true,
  });
};

/**
 *
 * @param identity: Name of cache identity to get valus from
 * @returns: values resolved from cache or nothing
 */
export const GetLocalKeys = (identity) => {
  let retrieved = cookieCutter.get(identity);

  if (retrieved) {
    return retrieved;
  }

  return;
};
