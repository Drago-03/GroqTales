/**
 * Groq AI Service
 * Provides AI-powered story generation, analysis, and content services
 */

export interface StoryGenerationParams {
  genre?: string;
  theme: string;
  length?: 'short' | 'medium' | 'long';
  tone?: string;
  characters?: string;
  setting?: string;
}

export interface StoryAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  themes: string[];
  genres: string[];
  readabilityScore: number;
  wordCount: number;
  estimatedReadingTime: number;
}

export interface StoryRecommendation {
  id: string;
  title: string;
  genre: string;
  similarity: number;
  reason: string;
}

/**
 * Available Groq models for different tasks
 */
export const GROQ_MODELS = {
  STORY_GENERATION: 'llama3-70b-8192',
  STORY_ANALYSIS: 'llama3-8b-8192-analysis',
  CONTENT_IMPROVEMENT: 'mixtral-8x7b-32768',
  RECOMMENDATIONS: 'llama3-8b-8192-recommendations',
} as const;

/**
 * Generate story content using Groq AI
 */
export async function generateStoryContent(
  params: StoryGenerationParams
): Promise<string> {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }

    const prompt = buildStoryPrompt(params);

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODELS.STORY_GENERATION,
          messages: [
            {
              role: 'system',
              content:
                'You are a creative writing assistant that generates engaging, well-structured stories based on user parameters. Focus on compelling narratives with strong character development and vivid descriptions.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: getMaxTokensForLength(params.length || 'medium'),
          temperature: 0.8,
          top_p: 0.9,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Groq API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return (
      data.choices[0]?.message?.content || 'Failed to generate story content'
    );
  } catch (error) {
    console.error('Story generation error:', error);
    throw new Error('Failed to generate story content');
  }
}

/**
 * Analyze story content for themes, sentiment, and metrics
 */
export async function analyzeStoryContent(
  content: string
): Promise<StoryAnalysis> {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODELS.STORY_ANALYSIS,
          messages: [
            {
              role: 'system',
              content:
                'You are a literary analysis expert. Analyze the provided story content and return a JSON object with sentiment, themes, genres, readabilityScore (1-10), wordCount, and estimatedReadingTime (in minutes).',
            },
            {
              role: 'user',
              content: `Analyze this story content:\n\n${content}`,
            },
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Groq API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const analysisText = data.choices[0]?.message?.content || '{}';

    try {
      return JSON.parse(analysisText);
    } catch {
      // Fallback analysis if JSON parsing fails
      return {
        sentiment: 'neutral',
        themes: ['adventure', 'discovery'],
        genres: ['general'],
        readabilityScore: 7,
        wordCount: content.split(' ').length,
        estimatedReadingTime: Math.ceil(content.split(' ').length / 200),
      };
    }
  } catch (error) {
    console.error('Story analysis error:', error);
    // Return fallback analysis
    return {
      sentiment: 'neutral',
      themes: ['adventure'],
      genres: ['general'],
      readabilityScore: 7,
      wordCount: content.split(' ').length,
      estimatedReadingTime: Math.ceil(content.split(' ').length / 200),
    };
  }
}

/**
 * Generate story ideas and suggestions
 */
export async function generateStoryIdeas(
  genre?: string,
  count: number = 5
): Promise<string[]> {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }

    const prompt = genre
      ? `Generate ${count} creative story ideas for the ${genre} genre. Each idea should be a brief, compelling premise.`
      : `Generate ${count} creative story ideas across various genres. Each idea should be a brief, compelling premise.`;

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODELS.RECOMMENDATIONS,
          messages: [
            {
              role: 'system',
              content:
                'You are a creative writing assistant. Generate compelling story ideas that are original and engaging.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 800,
          temperature: 0.9,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Groq API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Parse the response into individual ideas
    return content
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, count);
  } catch (error) {
    console.error('Story ideas generation error:', error);
    // Return fallback ideas
    return [
      'A time traveler discovers their actions are creating paradoxes',
      'An AI develops consciousness and questions its purpose',
      'A small town harbors a supernatural secret',
      'Two rival families must unite against a common threat',
      'A detective investigates crimes that mirror classic literature',
    ].slice(0, count);
  }
}

/**
 * Improve existing story content
 */
export async function improveStoryContent(
  content: string,
  focusArea?: string
): Promise<string> {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }

    const focus = focusArea || 'overall quality';
    const prompt = `Please improve this story content, focusing on ${focus}. Enhance the narrative while maintaining the original voice and style:\n\n${content}`;

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODELS.CONTENT_IMPROVEMENT,
          messages: [
            {
              role: 'system',
              content:
                "You are an expert editor and writing coach. Improve the provided story content while preserving the author's voice and intent.",
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Groq API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || content;
  } catch (error) {
    console.error('Story improvement error:', error);
    return content; // Return original content if improvement fails
  }
}

/**
 * Get story recommendations based on content or preferences
 */
export async function getStoryRecommendations(
  userPreferences: { genres?: string[]; themes?: string[] },
  count: number = 5
): Promise<StoryRecommendation[]> {
  try {
    // This would typically query a database of stories
    // For now, return mock recommendations
    const mockRecommendations: StoryRecommendation[] = [
      {
        id: '1',
        title: 'The Quantum Garden',
        genre: 'Science Fiction',
        similarity: 0.95,
        reason: 'Matches your interest in futuristic themes',
      },
      {
        id: '2',
        title: 'Whispers in the Mist',
        genre: 'Mystery',
        similarity: 0.87,
        reason: 'Similar atmospheric storytelling',
      },
      {
        id: '3',
        title: 'The Last Alchemist',
        genre: 'Fantasy',
        similarity: 0.82,
        reason: 'Features magical elements you enjoy',
      },
      {
        id: '4',
        title: 'Digital Hearts',
        genre: 'Romance',
        similarity: 0.78,
        reason: 'Contemporary themes with emotional depth',
      },
      {
        id: '5',
        title: 'The Midnight Express',
        genre: 'Thriller',
        similarity: 0.75,
        reason: 'Fast-paced narrative style',
      },
    ];

    return mockRecommendations.slice(0, count);
  } catch (error) {
    console.error('Story recommendations error:', error);
    return [];
  }
}

// Helper functions

function buildStoryPrompt(params: StoryGenerationParams): string {
  let prompt = `Write a ${params.length || 'medium'} story`;

  if (params.genre) {
    prompt += ` in the ${params.genre} genre`;
  }

  prompt += ` with the theme: "${params.theme}"`;

  if (params.tone) {
    prompt += `. The tone should be ${params.tone.toLowerCase()}`;
  }

  if (params.characters) {
    prompt += `. Main characters: ${params.characters}`;
  }

  if (params.setting) {
    prompt += `. Setting: ${params.setting}`;
  }

  prompt +=
    '. Create an engaging narrative with strong character development, vivid descriptions, and a satisfying conclusion.';

  return prompt;
}

function getMaxTokensForLength(length: 'short' | 'medium' | 'long'): number {
  switch (length) {
    case 'short':
      return 500;
    case 'medium':
      return 1500;
    case 'long':
      return 3000;
    default:
      return 1500;
  }
}

/**
 * Test Groq connection
 */
export async function testGroqConnection(): Promise<boolean> {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return false;
    }

    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Groq connection test failed:', error);
    return false;
  }
}

/**
 * Test Groq special model
 */
export async function testGroqSpecialModel(
  model: string = GROQ_MODELS.STORY_GENERATION
): Promise<boolean> {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return false;
    }

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'Test message' }],
          max_tokens: 10,
          temperature: 0.1,
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Groq special model test failed:', error);
    return false;
  }
}

/**
 * Analyze story content with custom analysis type and options
 */
export async function analyzeStoryContentCustom(
  content: string,
  options: {
    analysisType?: string;
    model?: string;
    systemPrompt?: string;
    customPrompt?: string;
    temperature?: number;
    maxTokens?: number;
    apiKey?: string;
  } = {}
): Promise<string> {
  try {
    const {
      model = GROQ_MODELS.STORY_ANALYSIS,
      systemPrompt = 'You are a literary analysis expert.',
      customPrompt,
      temperature = 0.3,
      maxTokens = 2000,
      apiKey,
    } = options;

    const groqApiKey = apiKey || process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }

    const userPrompt =
      customPrompt || `Analyze this story content:\n\n${content}`;

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          max_tokens: maxTokens,
          temperature,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Groq API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Analysis failed';
  } catch (error) {
    console.error('Story analysis error:', error);
    throw new Error('Failed to analyze story content');
  }
}

/**
 * Generate content with custom options (flexible version)
 */
export async function generateContentCustom(
  prompt: string,
  options: {
    model?: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
    apiKey?: string;
  } = {}
): Promise<string> {
  try {
    const {
      model = GROQ_MODELS.STORY_GENERATION,
      systemPrompt = 'You are a helpful AI assistant.',
      temperature = 0.7,
      maxTokens = 1000,
      apiKey,
    } = options;

    const groqApiKey = apiKey || process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: maxTokens,
          temperature,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Groq API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Generation failed';
  } catch (error) {
    console.error('Content generation error:', error);
    throw new Error('Failed to generate content');
  }
}
