import express from "express";

const router = express.Router();

router.post("/generate-video", (req, res) => {
  res.json({
    videoUrl: "http://localhost:5000/videos/modiji.mp4",
    captions: "This is a sample REACTJS lesson video."
  });
});

// ✅ THIS LINE IS REQUIRED
export default router;
