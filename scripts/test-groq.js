/**
 * Test script for Groq API integration
 * 
 * This script tests the connection to Groq's API and verifies that the models
 * are working as expected.
 * 
 * Usage: node scripts/test-groq.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Groq API key
const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";

// Available models
const MODELS = {
  LLAMA_3_70B: "llama-3.3-70b-versatile",
  LLAMA_4_SCOUT: "meta-llama/llama-4-scout-17b-16e-instruct",
  MIXTRAL: "mixtral-8x7b-32768",
  GEMMA: "gemma-7b-it"
};

/**
 * Test the Groq API with a simple prompt
 */
function testGroqApi(model) {
  console.log(`Testing Groq API with model: ${model}`);
  
  try {
    const command = `curl https://api.groq.com/openai/v1/chat/completions -s \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${GROQ_API_KEY}" \
      -d '{
        "model": "${model}",
        "messages": [{
          "role": "user",
          "content": "Write a very short story about a writer who discovers an AI that can predict the future."
        }],
        "max_tokens": 300
      }'`;
    
    const result = execSync(command, { encoding: 'utf-8' });
    const response = JSON.parse(result);
    
    if (response.choices && response.choices.length > 0) {
      console.log("\nAPI Response SUCCESS ✅");
      console.log("Generated content:");
      console.log("-------------------------------------");
      console.log(response.choices[0].message.content);
      console.log("-------------------------------------");
      console.log(`Total tokens: ${response.usage.total_tokens}`);
      console.log(`Time taken: ${response.usage.completion_time_ms}ms\n`);
    } else {
      console.error("Unexpected response format:", response);
    }
  } catch (error) {
    console.error("Error testing Groq API:", error.message);
    
    if (error.stdout) {
      try {
        const errorData = JSON.parse(error.stdout);
        console.error("API Error details:", errorData.error);
      } catch (e) {
        console.error("Raw error output:", error.stdout);
      }
    }
  }
}

/**
 * Write environment variable to .env file if it doesn't exist
 */
function setupEnvironmentVariables() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  // Check if .env.local exists
  let envContent = '';
  try {
    envContent = fs.readFileSync(envPath, 'utf-8');
  } catch (error) {
    // File doesn't exist, create it
    console.log("Creating .env.local file...");
  }
  
  // Check if GROQ_API_KEY exists in .env.local
  if (!envContent.includes('NEXT_PUBLIC_GROQ_API_KEY=')) {
    console.log("Adding GROQ_API_KEY to .env.local...");
    fs.appendFileSync(envPath, `\n# Groq API Configuration\nNEXT_PUBLIC_GROQ_API_KEY=${GROQ_API_KEY}\n`);
  }
}

// Main execution
console.log("=== GROQ API INTEGRATION TEST ===");
setupEnvironmentVariables();

// Test with a single model - change this to test different models
testGroqApi(MODELS.LLAMA_4_SCOUT);

console.log("\n=== TEST COMPLETED ===");
console.log("If you see a story above, the API is working correctly!");
console.log("You can now use the Groq service in your application.");
console.log("The API key has been added to your .env.local file for future use."); 