import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("views"));
app.use(express.json());

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// ======================
//  TIKTOK DOWNLOADER
// ======================
app.get("/api/tiktok", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.json({ error: "Masukkan URL TikTok!" });

  try {
    const api = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
    const data = await api.json();
    if (data && data.data && data.data.play) {
      res.json({
        status: "success",
        video: data.data.play,
        music: data.data.music,
        title: data.data.title,
        cover: data.data.cover,
      });
    } else {
      res.json({ error: "Gagal mengambil video TikTok" });
    }
  } catch (e) {
    res.json({ error: "Server TikTok error" });
  }
});

// ======================
//  INSTAGRAM DOWNLOADER
// ======================
app.get("/api/instagram", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.json({ error: "Masukkan URL Instagram!" });

  try {
    // gunakan endpoint igdl nya reysekha (free public)
    const api = await fetch(`https://api.reysekha.tech/api/downloader/instagram?url=${encodeURIComponent(url)}`);
    const data = await api.json();

    if (data.status && data.result && data.result.url) {
      res.json({
        status: "success",
        media: data.result.url,
        caption: data.result.caption || "",
      });
    } else {
      res.json({ error: "Gagal mengambil video Instagram" });
    }
  } catch (e) {
    res.json({ error: "Server Instagram error" });
  }
});

// ======================
//  YOUTUBE DOWNLOADER
// ======================
app.get("/api/youtube", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.json({ error: "Masukkan URL YouTube!" });

  try {
    const api = await fetch(`https://api.ryzendesu.vip/api/ytmp4?url=${encodeURIComponent(url)}`);
    const data = await api.json();

    if (data.result && data.result.download_url) {
      res.json({
        status: "success",
        title: data.result.title,
        thumb: data.result.thumbnail,
        video: data.result.download_url,
      });
    } else {
      res.json({ error: "Gagal mengambil video YouTube" });
    }
  } catch (e) {
    res.json({ error: "Server YouTube error" });
  }
});

app.listen(PORT, () => console.log(`🚀 Seren Downloader aktif di port ${PORT}`));
