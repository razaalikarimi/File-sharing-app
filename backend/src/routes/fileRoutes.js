// backend/src/routes/fileRoutes.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const crypto = require("crypto");

const auth = require("../middleware/auth");
const File = require("../models/File");
const User = require("../models/User");

const router = express.Router();

// ===== Multer config =====
const uploadsDir = path.join(__dirname, "..", "..", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Allowed MIME types
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

// File size limit: 10 MB
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false);
    }
    cb(null, true);
  },
});

// ===== Helper functions =====
const isLinkValid = (link) => {
  if (!link) return false;
  if (link.expiresAt && link.expiresAt < new Date()) {
    return false;
  }
  return true;
};

const canAccessFile = (userId, file, token) => {
  if (!file) return false;

  // Owner
  if (userId && file.owner.equals(userId)) return true;

  // sharedWith
  if (
    userId &&
    file.sharedWith &&
    file.sharedWith.some((uid) => uid.equals(userId))
  ) {
    return true;
  }

  // share link via token
  if (token) {
    const foundLink = file.shareLinks.find((l) => l.token === token);
    if (isLinkValid(foundLink)) return true;
  }

  return false;
};

// ===== Routes =====

// POST /api/files/upload
router.post("/upload", auth, upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const createdFiles = await Promise.all(
      req.files.map((f) =>
        File.create({
          owner: req.user._id,
          originalName: f.originalname,
          storedName: f.filename,
          mimetype: f.mimetype,
          size: f.size,
        })
      )
    );

    res.status(201).json({
      message: "Files uploaded successfully",
      files: createdFiles,
    });
  } catch (error) {
    console.error("Upload error:", error);

    if (error.message === "Invalid file type") {
      return res.status(400).json({ message: "Invalid file type" });
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Max 10 MB allowed." });
    }

    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/files/my
router.get("/my", auth, async (req, res) => {
  try {
    const files = await File.find({ owner: req.user._id }).sort({
      uploadDate: -1,
    });

    res.json({ files });
  } catch (error) {
    console.error("Get my files error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/files/shared/with-me
router.get("/shared/with-me", auth, async (req, res) => {
  try {
    const files = await File.find({ sharedWith: req.user._id })
      .populate("owner", "name email")
      .sort({ uploadDate: -1 });

    res.json({ files });
  } catch (error) {
    console.error("Shared-with-me error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/files/:id (metadata for owner/shared-with)
router.get("/:id", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (!canAccessFile(req.user._id, file)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ file });
  } catch (error) {
    console.error("Get file error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/files/:fileId/share/users
router.post("/:fileId/share/users", auth, async (req, res) => {
  try {
    const { emails } = req.body;

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: "Emails array is required" });
    }

    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (!file.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Only owner can share this file" });
    }

    const users = await User.find({ email: { $in: emails } });

    const userIds = users.map((u) => u._id.toString());
    const currentIds = file.sharedWith.map((id) => id.toString());

    userIds.forEach((id) => {
      if (!currentIds.includes(id)) {
        file.sharedWith.push(id);
      }
    });

    await file.save();

    res.json({
      message: "File shared with users",
      sharedWith: file.sharedWith,
    });
  } catch (error) {
    console.error("Share with users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/files/:fileId/share/link  (create shareable link)
router.post("/:fileId/share/link", auth, async (req, res) => {
  try {
    const { expiresAt } = req.body;

    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (!file.owner.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only owner can create share link" });
    }

    const token = crypto.randomBytes(24).toString("hex");

    const linkData = { token };
    if (expiresAt) {
      linkData.expiresAt = new Date(expiresAt);
    }

    file.shareLinks.push(linkData);
    await file.save();

    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
    // 👇 yahan public route ka URL de rahe hain
    const shareUrl = `${frontendUrl}/access/${token}`;

    res.json({
      message: "Share link created",
      token,
      shareUrl,
      expiresAt: linkData.expiresAt || null,
    });
  } catch (error) {
    console.error("Share link error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PUBLIC: GET /api/files/public/access/:token  (no auth)
router.get("/public/access/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const file = await File.findOne({ "shareLinks.token": token }).populate(
      "owner",
      "name email"
    );

    if (!file) {
      return res.status(404).json({ message: "Link or file not found" });
    }

    const link = file.shareLinks.find((l) => l.token === token);

    if (!isLinkValid(link)) {
      return res.status(410).json({ message: "Link has expired" });
    }

    res.json({
      message: "Link is valid",
      file: {
        id: file._id,
        originalName: file.originalName,
        mimetype: file.mimetype,
        size: file.size,
        uploadDate: file.uploadDate,
        owner: file.owner,
      },
    });
  } catch (error) {
    console.error("Public access via token error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PUBLIC: GET /api/files/public/download/:token  (no auth)
router.get("/public/download/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const file = await File.findOne({ "shareLinks.token": token });

    if (!file) {
      return res.status(404).json({ message: "Link or file not found" });
    }

    const link = file.shareLinks.find((l) => l.token === token);

    if (!isLinkValid(link)) {
      return res.status(410).json({ message: "Link has expired" });
    }

    const filePath = path.join(uploadsDir, file.storedName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Stored file not found" });
    }

    res.download(filePath, file.originalName);
  } catch (error) {
    console.error("Public download via token error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/files/download/:id  (protected - owner/shared-with)
router.get("/download/:id", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (!canAccessFile(req.user._id, file)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const filePath = path.join(uploadsDir, file.storedName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Stored file not found" });
    }

    res.download(filePath, file.originalName);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/files/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (!file.owner.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only owner can delete this file" });
    }

    const filePath = path.join(uploadsDir, file.storedName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await File.deleteOne({ _id: file._id });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
