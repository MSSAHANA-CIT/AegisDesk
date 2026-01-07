// Vercel Serverless Function for OpenAI API
// This keeps the API key secure on the server side
export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // Get API key from environment variable (supports both names)
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_API;
  if (!apiKey) {
    console.error("OPENAI_API_KEY or OPEN_API environment variable is not set");
    return res.status(500).json({ error: "Server configuration error: Missing OPENAI_API_KEY or OPEN_API environment variable" });
  }

  // Get messages from request body
  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or invalid messages array" });
  }

  try {
    // Use faster model and optimized settings for speed
    let model = "gpt-3.5-turbo"; // Faster than gpt-4o-mini
    
    // Create timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
    
    // Call OpenAI API with timeout
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: 1000, // Reduced for faster responses
        temperature: 0.7, // Slightly lower for faster generation
        top_p: 0.9,
        frequency_penalty: 0.2,
        presence_penalty: 0.2,
        stream: false
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    const data = await response.json();

    // Handle OpenAI API errors
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI API error",
        details: data.error
      });
    }

    // Return successful response
    return res.status(200).json(data);
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Handle timeout
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return res.status(504).json({ 
        error: "Request timeout. The AI is taking too long to respond. Please try again.",
        message: "Timeout after 25 seconds"
      });
    }
    
    return res.status(500).json({ 
      error: "Failed to communicate with OpenAI API",
      message: error.message 
    });
  }
}
