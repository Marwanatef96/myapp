/** @format */

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// =========================
// 📌 API ROUTES
// =========================

// ✅ Manga list (cache JSON 5 min)
app.get("/api/manga", async (req, res) => {
    try {
        const response = await axios.get("https://api.mangadex.org/manga", {
            headers: { "User-Agent": "MyReactApp/1.0" },
            params: req.query,
        });
        res.set("Cache-Control", "public, max-age=300");
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// ✅ Chapter list (cache JSON 5 min)
app.get("/api/chapter", async (req, res) => {
    try {
        const response = await axios.get("https://api.mangadex.org/chapter", {
            headers: { "User-Agent": "MyReactApp/1.0" },
            params: req.query,
        });
        res.set("Cache-Control", "public, max-age=300");
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// ✅ At-home server info (cache JSON 5 min)
app.get("/api/at-home/server/:chapterId", async (req, res) => {
    const { chapterId } = req.params;
    try {
        const response = await axios.get(
            `https://api.mangadex.org/at-home/server/${chapterId}`,
            { headers: { "User-Agent": "MyReactApp/1.0" } }
        );
        res.set("Cache-Control", "public, max-age=300");
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// ✅ Manga statistics (cache JSON 5 min)
app.get("/api/statistics/manga", async (req, res) => {
    try {
        const response = await axios.get(
            "https://api.mangadex.org/statistics/manga",
            {
                headers: { "User-Agent": "MyReactApp/1.0" },
                params: req.query,
            }
        );
        res.set("Cache-Control", "public, max-age=300");
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// ✅ Manga by ID (cache JSON 5 min)
app.get("/api/manga/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(
            `https://api.mangadex.org/manga/${id}`,
            {
                headers: { "User-Agent": "MyReactApp/1.0" },
                params: req.query,
            }
        );
        res.set("Cache-Control", "public, max-age=300");
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// ✅ Chapter by ID (cache JSON 5 min)
app.get("/api/chapter/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(
            `https://api.mangadex.org/chapter/${id}`,
            {
                headers: { "User-Agent": "MyReactApp/1.0" },
                params: req.query,
            }
        );
        res.set("Cache-Control", "public, max-age=300");
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// ✅ Tags (cache JSON 1 day)
app.get("/api/manga/tag", async (req, res) => {
    try {
        const response = await axios.get("https://api.mangadex.org/tag", {
            headers: { "User-Agent": "MyReactApp/1.0" },
        });
        res.set("Cache-Control", "public, max-age=86400");
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// ✅ Search manga by title (cache JSON 5 min)
app.get("/api/manga/search", async (req, res) => {
    const { title } = req.query;
    try {
        const response = await axios.get("https://api.mangadex.org/manga", {
            headers: { "User-Agent": "MyReactApp/1.0" },
            params: {
                title,
                limit: 10,
                includes: ["cover_art"],
                translatedLanguage: ["en"],
                ...req.query,
            },
        });
        res.set("Cache-Control", "public, max-age=300");
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// ✅ Manga cover (cache 1 year)
app.get("/cover/:mangaId/:fileName", async (req, res) => {
    const { mangaId, fileName } = req.params;
    try {
        const response = await axios.get(
            `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`,
            { responseType: "arraybuffer" }
        );
        res.set("Content-Type", response.headers["content-type"]);
        res.set("Cache-Control", "public, max-age=31536000, immutable");
        res.send(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// ✅ Chapter pages (cache 1 year)
app.get("/api/page/:chapterId/:fileName", async (req, res) => {
    try {
        const { chapterId, fileName } = req.params;
        const { data } = await axios.get(
            `https://api.mangadex.org/at-home/server/${chapterId}`
        );

        const baseUrl = data.baseUrl;
        const hash = data.chapter.hash;
        const imageUrl = `${baseUrl}/data/${hash}/${fileName}`;

        const response = await axios.get(imageUrl, {
            responseType: "arraybuffer",
        });

        res.set("Content-Type", response.headers["content-type"]);
        res.set("Cache-Control", "public, max-age=31536000, immutable");
        res.send(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =========================
// 📌 FRONTEND SERVE (cache 1 year for static)
// =========================
const buildPath = path.join(__dirname, "build");
app.use(
    express.static(buildPath, {
        maxAge: "1y",
        etag: true,
        lastModified: true,
        immutable: true,
    })
);

// React Router fallback
app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
});

// =========================
// 📌 START SERVER
// =========================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);
