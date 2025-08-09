// ✍️ PASTE THIS INTO: api/generate/route.js

import Groq from "groq-sdk";

// This sets up the connection to the Groq AI
// IMPORTANT: The GROQ_API_KEY must be set in your Vercel project settings
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// This helps Vercel run the code efficiently
export const runtime = "edge";

// This is the main function that runs when you send a request to /api/generate
export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // This makes the actual call to the Groq AI
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Write a short, engaging, and creative story based on the following prompt. Make sure the story is well-structured and interesting. Prompt: ${prompt}`,
        },
      ],
      model: "llama3-8b-8192",
      stream: true,
    });

    // This sends the AI's response back to the user's browser
    return new Response(stream.toReadableStream(), {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate story" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}