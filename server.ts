import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Gemini Setup
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  const genAI = new GoogleGenAI({ apiKey });

  // API Routes
  app.post("/api/generate", async (req, res) => {
    try {
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing. Please set it in the environment variables." });
      }
      const { prompt } = req.body;
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error Detail:", error?.response?.data || error);
      res.status(500).json({ error: error?.message || "Failed to generate content" });
    }
  });

  app.post("/api/refine", async (req, res) => {
    try {
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing. Please set it in the environment variables." });
      }
      const { history, currentSOP, feedback, systemInstruction } = req.body;
      
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history.map((msg: any) => ({
            role: msg.role === "model" ? "model" : "user",
            parts: [{ text: msg.text }]
          })),
          {
            role: "user",
            parts: [{ text: `현재 자소서:\n${currentSOP}\n\n피드백: ${feedback}` }]
          }
        ],
        config: {
          systemInstruction
        }
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Refine Error Detail:", error?.response?.data || error);
      res.status(500).json({ error: error?.message || "Failed to refine content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
