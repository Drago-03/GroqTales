/**
 * Groq API Integration Service
 * 
 * This service provides functions to interact with Groq's AI models for
 * generating stories, analyzing content, and enhancing user experience.
 */

// Default API key - replace with environment variable in production
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || "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";

// Available models
export const GROQ_MODELS = {
  LLAMA_3_70B: "llama-3.3-70b-versatile",
  LLAMA_4_SCOUT: "meta-llama/llama-4-scout-17b-16e-instruct",
  MIXTRAL: "mixtral-8x7b-32768",
  GEMMA: "gemma-7b-it"
};

// Base URL for Groq API
const GROQ_API_URL = "https://api.groq.com/openai/v1";

/**
 * Generates a story or content based on a given prompt
 * 
 * @param prompt The main prompt/instruction for the AI
 * @param model Optional model to use (defaults to Llama 3)
 * @param options Additional options like temperature, max_tokens, system_prompt, and apiKey
 * @returns The generated text
 */
export async function generateStoryContent(
  prompt: string,
  model: string = GROQ_MODELS.LLAMA_3_70B,
  options: {
    temperature?: number;
    max_tokens?: number;
    system_prompt?: string;
    apiKey?: string;
  } = {}
) {
  try {
    const { 
      temperature = 0.7, 
      max_tokens = 2000, 
      system_prompt,
      apiKey
    } = options;
    
    // Use custom API key if provided, otherwise use default
    const activeApiKey = apiKey || GROQ_API_KEY;
    
    const messages = [];
    
    // Add system prompt if provided
    if (system_prompt) {
      messages.push({
        role: "system",
        content: system_prompt
      });
    }
    
    // Add user message
    messages.push({
      role: "user",
      content: prompt
    });
    
    const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${activeApiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      throw new Error(`Groq API error: ${errorData.error?.message || "Unknown error"}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating content with Groq:", error);
    throw error;
  }
}

/**
 * Analyzes a story or text for sentiment, themes, and style
 * 
 * @param content The story or text to analyze
 * @param apiKey Optional custom Groq API key
 * @returns Analysis object with sentiment, themes, and style information
 */
export async function analyzeStoryContent(content: string, apiKey?: string) {
  const prompt = `
    Analyze the following story content and provide:
    1. Overall sentiment (positive, negative, mixed, neutral)
    2. Key themes (up to 5)
    3. Writing style characteristics
    4. Target audience
    5. Genre classification
    
    Format the response as a JSON object with these fields.
    
    Story content:
    "${content.substring(0, 4000)}"
  `;
  
  try {
    const analysisText = await generateStoryContent(
      prompt,
      GROQ_MODELS.LLAMA_3_70B,
      { 
        temperature: 0.3,
        apiKey
      }
    );
    
    // Extract JSON from text response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error("Could not parse analysis result");
  } catch (error) {
    console.error("Error analyzing content with Groq:", error);
    throw error;
  }
}

/**
 * Generates story ideas based on genre and optional parameters
 * 
 * @param genre The genre for the story
 * @param theme Optional theme to include
 * @param length Optional approximate length (short, medium, long)
 * @param apiKey Optional custom Groq API key
 * @returns Array of story ideas with titles and short descriptions
 */
export async function generateStoryIdeas(
  genre: string,
  theme?: string,
  length: "short" | "medium" | "long" = "medium",
  apiKey?: string
) {
  const promptParams = [];
  promptParams.push(`genre: ${genre}`);
  if (theme) promptParams.push(`theme: ${theme}`);
  promptParams.push(`length: ${length}`);
  
  const prompt = `
    Generate 3 unique story ideas with the following parameters:
    ${promptParams.join(", ")}
    
    For each idea, provide:
    1. A compelling title
    2. A short description (1-2 paragraphs)
    3. Main characters (1-3)
    4. Key plot points (3-5 bullet points)
    
    Format each idea as a JSON object in an array.
  `;
  
  try {
    const ideasText = await generateStoryContent(
      prompt,
      GROQ_MODELS.LLAMA_3_70B,
      { 
        temperature: 0.8,
        system_prompt: "You are a creative writing assistant that specializes in generating engaging story ideas.",
        apiKey
      }
    );
    
    // Extract JSON from text response
    const jsonMatch = ideasText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error("Could not parse story ideas result");
  } catch (error) {
    console.error("Error generating story ideas with Groq:", error);
    throw error;
  }
}

/**
 * Improves a given story or content by providing suggestions and enhancements
 * 
 * @param content The original story or text content
 * @param focus Optional area to focus improvements on (e.g., "dialogue", "description", "pacing")
 * @param apiKey Optional custom Groq API key
 * @returns Improved content and suggestions
 */
export async function improveStoryContent(content: string, focus?: string, apiKey?: string) {
  const promptParams = ["Improve the following story content"];
  if (focus) promptParams.push(`focusing especially on improving the ${focus}`);
  
  const prompt = `
    ${promptParams.join(", ")}:
    
    Original content:
    "${content.substring(0, 4000)}"
    
    Provide:
    1. Specific suggestions for improvement
    2. An enhanced version of the content
    3. Brief explanation of the changes made
  `;
  
  try {
    return await generateStoryContent(
      prompt,
      GROQ_MODELS.LLAMA_3_70B,
      { 
        temperature: 0.4,
        system_prompt: "You are an expert editor who helps writers improve their stories with constructive feedback and thoughtful revisions.",
        apiKey
      }
    );
  } catch (error) {
    console.error("Error improving content with Groq:", error);
    throw error;
  }
}

/**
 * Test function to verify Groq API connectivity
 * 
 * @param apiKey Optional custom Groq API key to test
 */
export async function testGroqConnection(apiKey?: string) {
  try {
    const result = await generateStoryContent(
      "Write a one-sentence test response to verify the API connection is working.",
      GROQ_MODELS.GEMMA,
      { 
        max_tokens: 50,
        apiKey
      }
    );
    
    return {
      success: true,
      message: result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
} 