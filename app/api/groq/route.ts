import { NextRequest, NextResponse } from 'next/server';
import { generateStoryContent, analyzeStoryContent, generateStoryIdeas, improveStoryContent } from '@/lib/groq-service';

/**
 * @api {post} /api/groq/generate Generate content with Groq AI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, prompt, content, genre, theme, length, model, options, focus, apiKey } = body;

    // Create updated options with API key if provided
    const updatedOptions = apiKey ? { ...options, apiKey } : options;
    
    let result;

    switch (action) {
      case 'generate':
        if (!prompt) {
          return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }
        result = await generateStoryContent(prompt, model, updatedOptions);
        break;

      case 'analyze':
        if (!content) {
          return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }
        // Pass apiKey to analyzeStoryContent (which internally uses generateStoryContent)
        result = await analyzeStoryContent(content, apiKey);
        break;

      case 'ideas':
        if (!genre) {
          return NextResponse.json({ error: 'Genre is required' }, { status: 400 });
        }
        // Pass apiKey to generateStoryIdeas (which internally uses generateStoryContent)
        result = await generateStoryIdeas(genre, theme, length, apiKey);
        break;

      case 'improve':
        if (!content) {
          return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }
        // Pass apiKey to improveStoryContent (which internally uses generateStoryContent)
        result = await improveStoryContent(content, focus, apiKey);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Groq API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

/**
 * @api {get} /api/groq/models Get available Groq AI models
 */
export async function GET() {
  try {
    // Import dynamically to avoid exposing models in the client bundle
    const { GROQ_MODELS } = await import('@/lib/groq-service');
    
    return NextResponse.json({ 
      models: GROQ_MODELS,
      default: GROQ_MODELS.LLAMA_3_70B
    });
  } catch (error: any) {
    console.error('Error fetching Groq models:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching models' },
      { status: 500 }
    );
  }
} 