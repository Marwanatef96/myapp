/** @format */

import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// --- MangaDex API proxy endpoints ---

// List manga
app.get("/api/manga", async (req, res) => {
    try {
        const response = await axios.get("https://api.mangadex.org/manga", {
            headers: { "User-Agent": "MyReactApp/1.0" },
            params: req.query,
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// List chapters
app.get("/api/chapter", async (req, res) => {
    try {
        const response = await axios.get("https://api.mangadex.org/chapter", {
            headers: { "User-Agent": "MyReactApp/1.0" },
            params: req.query,
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// MangaDex@Home server endpoint
app.get("/api/at-home/server/:chapterId", async (req, res) => {
    const { chapterId } = req.params;
    try {
        const response = await axios.get(
            `https://api.mangadex.org/at-home/server/${chapterId}`,
            { headers: { "User-Agent": "MyReactApp/1.0" } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// Manga statistics
app.get("/api/statistics/manga", async (req, res) => {
    try {
        const response = await axios.get(
            "https://api.mangadex.org/statistics/manga",
            {
                headers: { "User-Agent": "MyReactApp/1.0" },
                params: req.query,
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// Single manga by ID
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
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// Single chapter by ID
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
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// Cover images
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
        res.status(error.response?.status || 500).json({
            message: error.message,
        });
    }
});

// --- Serve React frontend ---
const buildPath = path.join(__dirname, "build");
app.use(express.static(buildPath));

// All other routes serve React index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
});

// --- Start server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
