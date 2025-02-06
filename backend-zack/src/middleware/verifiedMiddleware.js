import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const verifiedMiddleware = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user || !user.verified) {
      return res.status(403).json({ error: "You are not verified" });
    }

    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default verifiedMiddleware;
