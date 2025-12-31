// Vercel Serverless Function for OpenAI API
// This keeps the API key secure on the server side
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // Get API key from environment variable
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server configuration error: Missing OPENAI_API_KEY" });
  }

  // Get messages from request body
  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or invalid messages array" });
  }

  try {
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    const data = await response.json();

    // Return the same status code from OpenAI
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ 
      error: "Failed to communicate with OpenAI API",
      message: error.message 
    });
  }
}
