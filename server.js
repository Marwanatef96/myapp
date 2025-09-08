const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// --- MangaDex API proxy endpoints ---

app.get("/api/manga", async (req, res) => {
  try {
    const response = await axios.get("https://api.mangadex.org/manga", {
      headers: { "User-Agent": "MyReactApp/1.0" },
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: error.message });
  }
});

app.get("/api/chapter", async (req, res) => {
  try {
    const response = await axios.get("https://api.mangadex.org/chapter", {
      headers: { "User-Agent": "MyReactApp/1.0" },
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: error.message });
  }
});

app.get("/api/at-home/server/:chapterId", async (req, res) => {
  const { chapterId } = req.params;
  try {
    const response = await axios.get(
      `https://api.mangadex.org/at-home/server/${chapterId}`,
      { headers: { "User-Agent": "MyReactApp/1.0" } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: error.message });
  }
});

app.get("/api/statistics/manga", async (req, res) => {
  try {
    const response = await axios.get("https://api.mangadex.org/statistics/manga", {
      headers: { "User-Agent": "MyReactApp/1.0" },
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: error.message });
  }
});

app.get("/api/manga/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://api.mangadex.org/manga/${id}`, {
      headers: { "User-Agent": "MyReactApp/1.0" },
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: error.message });
  }
});

app.get("/api/chapter/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://api.mangadex.org/chapter/${id}`, {
      headers: { "User-Agent": "MyReactApp/1.0" },
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: error.message });
  }
});

app.get("/cover/:mangaId/:fileName", async (req, res) => {
  const { mangaId, fileName } = req.params;
  try {
    const response = await axios.get(
      `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`,
      { responseType: "arraybuffer" }
    );
    res.set("Content-Type", "image/jpeg");
    res.send(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ message: error.message });
  }
});

// --- Serve frontend ---
const buildPath = path.join(__dirname, "build");
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// --- Start server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
