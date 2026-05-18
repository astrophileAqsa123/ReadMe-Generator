const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateReadme = async ({
  repoName,
  description,
  language,
  fileTree,
  keyFiles,
  feedback,
  currentReadme
}) =>  {
 const prompt = `
You are an expert technical writer.

Generate a professional README.md for this repository.

REPOSITORY:
- Name: ${repoName}
- Description: ${description || "Not provided"}
- Language: ${language || "Unknown"}

FILE TREE:
${fileTree.slice(0, 120).join("\n")}

KEY FILES:
${keyFiles
  .map(
    ({ name, content }) =>
      `FILE: ${name}\n${content?.slice(0, 1500)}`
  )
  .join("\n\n")}

${
  currentReadme
    ? `
CURRENT README:
${currentReadme}
`
    : ""
}

${
  feedback
    ? `
USER REQUEST:
${feedback}

Modify the README according to the user's request.
`
    : ""
}

Requirements:
- Detect project type automatically
- Detect framework/libraries from files
- Detect setup steps automatically
- Generate professional markdown
- Add only relevant sections
- Avoid generic filler text
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
};

module.exports = { generateReadme };