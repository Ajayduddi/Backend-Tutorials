import { users } from "./constants.mjs";

/*
 * Declare and define middleware functions
 *
 */
export const resolveIndexById = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  console.log(parsedId);
  if (!isNaN(parsedId)) {
    const index = users.findIndex((u) => u.id == parsedId);
    req.index = index;
  } else {
    res.status(400).json({ result: false, message: "Bad request", data: null });
  }
  next();
};
