const SKILL_DICTIONARY = [
  "java",
  "javascript",
  "node.js",
  "node",
  "react",
  "react native",
  "sql",
  "mongodb",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "rest",
  "api",
  "microservices",
  "python",
  "git",
  "ci/cd",
  "linux",
  "typescript",
  "express",
  "spring",
  "spring boot",
  "redis",
  "rabbitmq",
  "kafka",
  "testing",
  "jest",
  "junit",
  "html",
  "css",
  "tailwind",
  "graphql",
  "llm",
  "ai",
  "machine learning",
  "prompt engineering"
];

function normalizeText(text) {
  return text.toLowerCase().replace(/\n/g, " ");
}

function extractSkills(text) {
  const normalized = normalizeText(text);
  const found = new Set();

  for (const skill of SKILL_DICTIONARY) {
    const pattern = new RegExp(`\\b${skill.replace(".", "\\.")}\\b`, "i");
    if (pattern.test(normalized)) {
      found.add(skill);
    }
  }

  return Array.from(found);
}

function computeMatchScore(resumeSkills, jdSkills) {
  if (jdSkills.length === 0) return 0;

  const jdSet = new Set(jdSkills);
  const resumeSet = new Set(resumeSkills);

  let matchedCount = 0;
  jdSet.forEach((skill) => {
    if (resumeSet.has(skill)) matchedCount++;
  });

  return Math.round((matchedCount / jdSet.size) * 100);
}

function generateSummary(score, matchedSkills, missingSkills) {
  let level;
  if (score >= 80) level = "strong";
  else if (score >= 60) level = "good";
  else if (score >= 40) level = "moderate";
  else level = "weak";

  return `Overall, this resume shows a ${level} match (${score}%) to the job description. It aligns on key skills like ${matchedSkills
    .slice(0, 5)
    .join(", ") || "some relevant areas"}, but is missing or under‑emphasizing skills such as ${missingSkills
    .slice(0, 5)
    .join(", ") || "some important requirements"}.`;
}

function generateSuggestions(missingSkills) {
  if (!missingSkills.length) {
    return [
      "Highlight specific impact and metrics for your past projects.",
      "Add more detail on system design, scalability, and ownership.",
      "Tailor your summary and skills section to mirror the job description language."
    ];
  }

  return [
    `Add or emphasize experience related to: ${missingSkills
      .slice(0, 5)
      .join(", ")}.`,
    "Include concrete examples (projects, internships, coursework) that demonstrate these skills.",
    "Update your summary and skills section to better reflect the requirements of this role."
  ];
}

export function analyzeResumeAgainstJD(resumeText, jobDescription) {
  const resumeSkills = extractSkills(resumeText);
  const jdSkills = extractSkills(jobDescription);

  const score = computeMatchScore(resumeSkills, jdSkills);

  const matchedSkills = jdSkills.filter((s) => resumeSkills.includes(s));
  const missingSkills = jdSkills.filter((s) => !resumeSkills.includes(s));

  const summary = generateSummary(score, matchedSkills, missingSkills);
  const suggestions = generateSuggestions(missingSkills);

  return {
    score,
    matchedSkills,
    missingSkills,
    resumeSkills,
    jdSkills,
    summary,
    suggestions
  };
}
