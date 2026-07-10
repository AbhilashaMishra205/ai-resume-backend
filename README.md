# AI Resume Analyzer — Backend

Node.js + Express backend API for the AI Resume Analyzer application.

##  Tech Stack
- Node.js + Express
- OpenAI GPT-4o-mini
- Deployed on Render

## API Endpoints

### POST /api/analyze
Analyzes resume against job description and returns match score.

**Request:**
```json
{
  "resumeText": "your resume text",
  "jobDescription": "job description text"
}
```

**Response:**
```json
{
  "score": 85,
  "matchedSkills": ["react", "aws"],
  "missingSkills": ["docker"],
  "summary": "Strong match...",
  "suggestions": ["Add docker experience..."]
}
```

### POST /api/rewrite-summary
Rewrites resume summary using OpenAI GPT-4o-mini.

### POST /api/rewrite-bullet
Rewrites a resume bullet point to be stronger and action-driven.

### POST /api/explain-skills
Explains why missing skills are important for the role.

##  Author
Abhilasha Mishra
[LinkedIn](https://linkedin.com/in/abhilasha-mishra-206b1a214)
