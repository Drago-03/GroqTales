import { generateNftEntries, topNftStories } from '@/app/nft-gallery/page';

/**
 * Fetches a story by its ID
 * @param id - The ID of the story to fetch
 * @param limit - Optional: Number of related stories to return if relatedStories is true
 * @param relatedStories - Optional: If true, returns related stories instead of a single story
 * @returns A single story object or an array of related stories
 */
export function fetchStoryById(id: string, limit?: number, relatedStories?: boolean): any {
  // Combine top stories with generated stories
  const allStories = [...topNftStories, ...generateNftEntries(90)];
  
  // If we're looking for related stories
  if (relatedStories) {
    const story = allStories.find(story => story.id === id);
    if (!story) return [];
    
    // Find stories of the same genre, excluding the current story
    return allStories
      .filter(s => s.genre === story.genre && s.id !== id)
      .slice(0, limit || 4);
  }
  
  // Otherwise return the specific story
  return allStories.find(story => story.id === id);
} 