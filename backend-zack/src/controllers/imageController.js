import { PrismaClient } from "@prisma/client";
import B2 from "backblaze-b2";
import fs from "fs";
import multer from "multer";
import path from "path";
import sharp from "sharp";

import addAnimatedBorder from "../utils/addAnimatedBorder.js";
import generateUniqueString from "../utils/generateUniqueString.js";
import isImage from "../utils/isImage.js";

import { fileURLToPath } from 'url';

import uploadAny from "@gideo-llc/backblaze-b2-upload-any";
B2.prototype.uploadAny = uploadAny;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, "./../../uploads");

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, generateUniqueString() + path.extname(file.originalname));
  },
});
const load = multer({ storage: storage });

// @desc    Upload image
// @route   POST /image/upload
// @access  Public
const upload = async (req, res) => {
  if (!req.files) {
    return res.status(400).json({
      error: "No file received.",
    });
  }

  const result = [];

  for (const file of req.files) {
    if (!isImage(file)) {
      return res.status(400).json({
        error: "Uploaded file is not an image.",
      });
    }

    if (file.size > 90 * 1024 * 1024) {
      return res.status(400).json({ error: "Image size limit exceeded." });
    }

    // Set up account credentials
    const b2 = new B2({
      accountId: process.env.B2_APPLICATION_KEY_ID,
      applicationKey: process.env.B2_APPLICATION_KEY,
    });

    try {
      const fileName = generateUniqueString() + path.extname(file.originalname);
      const fileStream = fs.createReadStream(file.path);

      // Await authorization and upload
      const r = await b2.authorize();
      await b2.uploadAny({
        bucketId: process.env.B2_BUCKET_ID,
        fileName,
        partSize: r.data.recommendedPartSize,
        data: fileStream,
      });

      // Delete the file
      fs.unlinkSync(file.path);

      // Insert into the database
      await prisma.image.create({
        data: {
          name: fileName,
          userId: req.user ? req.user.id : null,
          pub: !!(req.user && req.body.visible),
        },
      });

      result.push(fileName);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }

  res.status(200).json({
    message: "Image uploaded successfully.",
    files: result,
  });
};

const setProfile = async (req, res) => {
  const { name } = req.body;

  try {
    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        profileImage: name.split("/").pop(),
      },
    });

    res.status(200).json({
      message: "Profile updated successfully.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// @desc    Get image
// @route   GET /image/:name
// @access  Public
const get = async (req, res) => {
  const name = req.params.name;
  const noRedirect = req.query["no-redirect"];

  try {
    const image = await prisma.image.findUnique({
      where: {
        name: name,
      },
    });

    if (!image) {
      return noRedirect
        ? res.status(404).json({
            error: "The image doesn't exist.",
          })
        : res.redirect(`${process.env.FRONTEND_URL}/?notfound=true`);
    }

    // Set up account credentials
    const b2 = new B2({
      accountId: process.env.B2_APPLICATION_KEY_ID,
      applicationKey: process.env.B2_APPLICATION_KEY,
    });

    await b2.authorize();

    // Download
    const downloadResponse = await b2.downloadFileByName({
      bucketName: process.env.B2_BUCKET_NAME,
      fileName: name,
      responseType: "stream",
    });

    // Send
    res.set({
      "Content-Type": downloadResponse.headers["content-type"],
      "Cache-Control": "public, max-age=31536000",
    });
    downloadResponse.data.pipe(res);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  if (!req.user.profileImage) {
    return res.status(404).json({
      error: "The image doesn't exist",
    });
  }

  try {
    // Set up account credentials
    const b2 = new B2({
      accountId: process.env.B2_APPLICATION_KEY_ID,
      applicationKey: process.env.B2_APPLICATION_KEY,
    });

    await b2.authorize();

    // Download
    const downloadResponse = await b2.downloadFileByName({
      bucketName: process.env.B2_BUCKET_NAME,
      fileName: req.user.profileImage,
      responseType: "stream",
    });

    // Send
    res.set({
      "Content-Type": downloadResponse.headers["content-type"],
      "Cache-Control": "public, max-age=31536000",
    });
    downloadResponse.data.pipe(res);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// @desc    Get image data
// @route   GET /image/:name/metadata
// @access  Public
const metadata = async (req, res) => {
  const name = req.params.name;

  try {
    const image = await prisma.image.findUnique({
      where: {
        name: name,
      },
      include: {
        comments: {
          include: {
            user: {
              select: {
                name: true,
                profileImage: true,
              },
            },
          },
        },
        likes: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!image) {
      return res.status(404).json({
        error: "The image doesn't exist.",
      });
    }

    res.status(200).json({
      ...image,
      liked:
        image.likes.find((like) => like.userId === req.user?.id)?.like ?? null,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const likeDislike = (like) => async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const name = req.params.name;

  try {
    const image = await prisma.image.findUnique({
      where: {
        name: name,
      },
    });

    if (!image) {
      return res.status(404).json({
        error: "The image doesn't exist.",
      });
    }

    await prisma.like.upsert({
      where: {
        userId_imageId: {
          userId: req.user.id,
          imageId: image.id,
        },
      },
      create: {
        userId: req.user.id,
        imageId: image.id,
        like,
      },
      update: {
        like,
      },
    });

    res.status(200).json({
      message: "Image liked successfully.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const like = likeDislike(true);
const dislike = likeDislike(false);

const unlike = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const name = req.params.name;

  try {
    const image = await prisma.image.findUnique({
      where: {
        name: name,
      },
    });

    if (!image) {
      return res.status(404).json({
        error: "The image doesn't exist.",
      });
    }

    await prisma.like.delete({
      where: {
        userId_imageId: {
          userId: req.user.id,
          imageId: image.id,
        },
      },
    });

    res.status(200).json({
      message: "Image unliked successfully.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const comment = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const name = req.params.name;
  const { text } = req.body;

  try {
    const image = await prisma.image.findUnique({
      where: {
        name: name,
      },
    });

    if (!image) {
      return res.status(404).json({
        error: "The image doesn't exist.",
      });
    }

    await prisma.comment.create({
      data: {
        comment: text,
        userId: req.user.id,
        imageId: image.id,
      },
    });

    res.status(200).json({
      message: "Comment added successfully.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getList = async (req, res) => {
  let where;

  if (req.user) {
    where = {
      userId: req.user.id,
    };
  } else {
    where = {
      pub: true,
    };
  }

  try {
    const images = await prisma.image.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(images);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getAdminList = async (req, res) => {
  try {
    const images = await prisma.image.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(images);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const deleteImage = async (req, res) => {
  const name = req.params.name;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        admin: true,
        images: {
          where: {
            name,
          },
        },
      },
    });

    if (!user || (!user.admin && user.images.length === 0)) {
      return res.status(404).json({
        error: "The image doesn't exist.",
      });
    }

    const image = await prisma.image.delete({
      where: {
        name,
      },
    });

    if (!image) {
      return res.status(404).json({
        error: "The image doesn't exist.",
      });
    }

    res.status(200).json({
      message: "Image deleted successfully.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// @desc    Count images
// @route   GET /image/count
// @access  Public
const getCount = async (req, res) => {
  try {
    const count = await prisma.image.count();
    res.status(200).json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Animate image
// @route   POST /image/animate
// @access  Public
const animate = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "No file received.",
    });
  }

  if (!isImage(req.file)) {
    return res.status(400).json({
      error: "Uploaded file is not an image.",
    });
  }

  const { color1, color2 } = req.body;

  try {
    // Get image dimensions
    const metadata = await sharp(req.file.path).metadata();

    // Check if image dimensions exceed 1000x1000
    if (metadata.width > 500 || metadata.height > 500) {
      return res.status(400).json({
        error: "Image dimensions exceed the maximum allowed (500x500).",
      });
    }

    const gifStream = await addAnimatedBorder(req.file.path, color1, color2);

    // Delete the file
    fs.unlinkSync(req.file.path);

    res.set({
      "Content-Type": "image/gif",
    });

    gifStream.pipe(res);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  animate,
  get,
  getMe,
  metadata,
  like,
  unlike,
  dislike,
  comment,
  getCount,
  getList,
  getAdminList,
  deleteImage,
  load,
  upload,
  setProfile,
};
