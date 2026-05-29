import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { analyzeResumeAgainstJD } from "./resumeAnalyzer.js";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "AI Resume Analyzer API" });
});

// MAIN ANALYZE ROUTE
app.post("/api/analyze", (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        error: "resumeText and jobDescription are required"
      });
    }

    const result = analyzeResumeAgainstJD(resumeText, jobDescription);
    return res.json(result);
  } catch (err) {
    console.error("Error in /api/analyze:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// 1️⃣ Rewrite Summary
app.post("/api/rewrite-summary", async (req, res) => {
  try {
    const { summary, jobDescription } = req.body;

    const prompt = `
Rewrite this resume summary to match the job description.
Make it professional, concise, and ATS-friendly.

Summary:
${summary}

Job Description:
${jobDescription}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ rewritten: completion.choices[0].message.content });
  } catch (err) {
    console.error("Error rewriting summary:", err);
    res.status(500).json({ error: "Failed to rewrite summary" });
  }
});


// 2️⃣ Rewrite Bullet Point
app.post("/api/rewrite-bullet", async (req, res) => {
  try {
    const { bullet, jobDescription } = req.body;

    const prompt = `
Rewrite this resume bullet point to be stronger, action-driven, and aligned with the job description.

Bullet:
${bullet}

Job Description:
${jobDescription}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ rewritten: completion.choices[0].message.content });
  } catch (err) {
    console.error("Error rewriting bullet:", err);
    res.status(500).json({ error: "Failed to rewrite bullet" });
  }
});


// 3️⃣ Explain Missing Skills
app.post("/api/explain-skills", async (req, res) => {
  try {
    const { missingSkills, jobDescription } = req.body;

    const prompt = `
Explain why these skills are important for the job and how the candidate can add them to their resume:

Missing Skills:
${missingSkills.join(", ")}

Job Description:
${jobDescription}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ explanation: completion.choices[0].message.content });
  } catch (err) {
    console.error("Error explaining skills:", err);
    res.status(500).json({ error: "Failed to explain skills" });
  }
});


// SERVER START — MUST BE LAST
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
