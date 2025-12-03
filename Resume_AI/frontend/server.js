import http from "node:http";
import { URL } from "node:url";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config({ path: ".env.local" });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_FAST = "gemini-2.5-flash";

const readBody = (req) => {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
};

const DIST_DIR = path.join(process.cwd(), "dist");

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const pathname = url.pathname;

  try {
    if (req.method === "POST" && pathname === "/api/optimizeText") {
      const body = JSON.parse(await readBody(req) || "{}");
      const text = body.text || "";
      const type = body.type || "summary";

      let prompt = "";
      if (type === "summary") {
        prompt = `Rewrite the following resume summary to be more professional, concise, and impactful for a university graduate. Keep it under 50 words: "${text}"`;
      } else if (type === "bullet") {
        prompt = `Optimize the following job/project description bullet point. Use strong action verbs, quantify results where possible, and make it professional. Output only the optimized text: "${text}"`;
      } else if (type === "skills") {
        prompt = `Given the following loose list of skills, format them into a clean, categorized list (e.g., Languages, Frameworks, Tools). Return only the formatted text: "${text}"`;
      }

      const response = await ai.models.generateContent({ model: MODEL_FAST, contents: prompt });
      const result = { text: (response.text || "").trim() };
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(result));
      return;
    }

    if (req.method === "POST" && pathname === "/api/analyzeJobMatch") {
      const body = JSON.parse(await readBody(req) || "{}");
      const resumeText = String(body.resumeText || "");
      const jobDescription = String(body.jobDescription || "");

      const prompt = `
    Analyze the match between the Resume and the Job Description provided below.
    
    Resume:
    ${resumeText.substring(0, 4000)}

    Job Description:
    ${jobDescription.substring(0, 4000)}

    Return a JSON object with:
    1. "score": a number between 0 and 100 representing the match percentage.
    2. "analysis": a brief 2-3 sentence summary of why they match or don't.
    3. "missingKeywords": an array of strings listing key skills/requirements missing from the resume.
    4. "suggestions": an array of actionable tips to improve the resume for this specific job.
  `;

      const response = await ai.models.generateContent({
        model: MODEL_FAST,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              analysis: { type: Type.STRING },
              missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
        },
      });

      const json = JSON.parse(response.text || "{}");
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(json));
      return;
    }

    if (req.method === "POST" && pathname === "/api/searchJobs") {
      const body = JSON.parse(await readBody(req) || "{}");
      const query = String(body.query || "");

      const response = await ai.models.generateContent({
        model: MODEL_FAST,
        contents: `Find 4-5 recent, real job postings for university students or fresh graduates related to: "${query}". Return a JSON array of job objects. For each job, provide a 'title', 'company', 'location', and a 'description' (which should be a brief summary of requirements).`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                location: { type: Type.STRING },
                description: { type: Type.STRING },
                url: { type: Type.STRING },
              },
            },
          },
        },
      });

      const jobs = JSON.parse(response.text || "[]");
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(jobs));
      return;
    }

    if (req.method === "GET" && !pathname.startsWith("/api")) {
      const filePath = pathname === "/" ? path.join(DIST_DIR, "index.html") : path.join(DIST_DIR, pathname);
      const ext = path.extname(filePath);
      const types = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".ico": "image/x-icon"
      };
      const type = types[ext] || "application/octet-stream";
      fs.readFile(filePath, (err, data) => {
        if (err) {
          const fallback = path.join(DIST_DIR, "index.html");
          fs.readFile(fallback, (fbErr, fbData) => {
            if (fbErr) {
              res.statusCode = 404;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Not Found" }));
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/html");
              res.end(fbData);
            }
          });
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", type);
          res.end(data);
        }
      });
      return;
    }

    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Not Found" }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 8787;
server.listen(port);
console.log(`Server listening on http://localhost:${port}`);
