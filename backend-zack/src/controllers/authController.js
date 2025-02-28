import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto, { randomUUID } from "crypto";
import { readFileSync } from "fs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

// @desc    Register user
// @route   POST /auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password } = req.body;
  let ip = req.cf_ip || req.ip;
  
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ name: name }, { email: email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error:
          "This username or email address is already associated to another account.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const resetToken = randomUUID();

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        resetToken: resetToken,
        ip,
      },
    });

    const resend = new Resend(process.env.RESEND_KEY);

    const resendStatus = await resend.emails.send({
      from: "Support <noreply@help.picto.gg>",
      to: email,
      subject: "Confirm your email",
      html: readFileSync(
        path.join(__dirname, "../../email-confirm.html"),
        "utf8"
      )
        .replace("{USERNAME}", name)
        .replace("{LINK}", `https://picto.gg/?confirm=${resetToken}`),
    });

    if ("error" in resendStatus && resendStatus.error) {
      console.error(resendStatus.error);
    }

    // Generate JWT
    const token = generateAccessToken(newUser.id);

    res.status(201).json({
      message: "Successful sign up.",
      token,
      admin: newUser.admin,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
const login = async (req, res) => {
  const { name, password } = req.body;
  let ip = req.cf_ip || req.ip;
  console.log(ip);
  try {
    // Check if a user with the provided name exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ name: name }, { email: name }],
      },
    });

    if (!existingUser) {
      return res.status(401).json({
        error: "Invalid email / username or password.",
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid email / username or password.",
      });
    }

    // Generate JWT
    const token = generateAccessToken(existingUser.id);

    if (!existingUser.ip) {
      if (name.includes("@")) {
        await prisma.user.update({
          where: {
            email: name
          },
          data: {
            ip,
          },
        });
      } else {
        await prisma.user.update({
          where: {
            name: name
          },
          data: {
            ip,
          },
        });
      }
    }

    res.status(200).json({
      message: "Successful login.",
      username: existingUser.name,
      token,
      admin: existingUser.admin,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const forgot = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email address.",
      });
    }

    const token = crypto.randomUUID();

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        resetToken: token,
      },
    });

    const resend = new Resend(process.env.RESEND_KEY);

    const resendStatus = await resend.emails.send({
      from: "Support <noreply@help.picto.gg>",
      to: email,
      subject: "Password Reset",
      html: readFileSync(path.join(__dirname, "../../email.html"), "utf8")
        .replace("{USERNAME}", user.name)
        .replace("{LINK}", `https://picto.gg/reset/${token}`),
    });

    if ("error" in resendStatus && resendStatus.error) {
      console.error(resendStatus.error);
    }

    res.status(201).json({
      message: "Reset token generated.",
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const reset = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid token.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.updateMany({
      where: {
        resetToken: token,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
      },
    });

    res.status(200).json({
      message: "Password reset successful.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const verify = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid token.",
      });
    }

    await prisma.user.update({
      where: {
        resetToken: token,
        name: user.name
      },
      data: {
        resetToken: null,
        verified: true,
      },
    });

    res.status(200).json({
      message: "Email verified.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

export { forgot, login, register, reset, verify };
