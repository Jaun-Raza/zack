import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
  req.user = null;

  if (
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")) ||
    req.query.token
  ) {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : req.query.token;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (e) {}
    if (decoded && decoded.id) {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: decoded.id,
          },
        });

        if (user) {
          req.user = user;
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  next();
};

export default authenticate;
