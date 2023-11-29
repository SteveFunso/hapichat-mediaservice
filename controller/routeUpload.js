const express = require("express");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/multer");

router.post(
  "/media",
  upload.array("media", 3),

  async function (req, res) {
    const files = req.files;

    console.log("These are the files", files);

    try {
      const uploadPromises = files.map(async (file) => {
        const isImage = file.mimetype.startsWith("image");
        const isVideo = file.mimetype.startsWith("video");

        const result = isImage
          ? await cloudinary.uploader.upload(file.path)
          : isVideo
          ? await cloudinary.uploader.upload(file.path, {
              resource_type: "video",
            })
          : null;

        return { success: true, message: "Uploaded!", data: result };
      });

      const uploadResults = await Promise.all(uploadPromises);

      res.status(200).json(uploadResults);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error",
      });
    }
  }
);

module.exports = router;
