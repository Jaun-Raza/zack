import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adminMiddleware = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user || !user.admin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default adminMiddleware;
