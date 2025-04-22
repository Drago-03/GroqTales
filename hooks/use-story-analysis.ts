"use client";

import { useState } from "react";

interface AnalysisOptions {
  content: string;
  title?: string;
  genre?: string;
  analysisType?: 'standard' | 'critique' | 'audience' | 'development';
  model?: string;
  apiKey?: string;
}

interface AnalysisResult {
  success: boolean;
  analysis: any;
  format: 'json' | 'text';
  analysisType: string;
}

interface UseStoryAnalysisResult {
  analyzeStory: (options: AnalysisOptions) => Promise<AnalysisResult | null>;
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  clearResult: () => void;
}

export function useStoryAnalysis(): UseStoryAnalysisResult {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Analyze a story using Groq API
   */
  const analyzeStory = async (options: AnalysisOptions): Promise<AnalysisResult | null> => {
    const { content, title, genre, analysisType = 'standard', model, apiKey } = options;
    
    if (!content) {
      setError("Story content is required");
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/story-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          title,
          genre,
          analysisType,
          model,
          apiKey,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze story");
      }
      
      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear the analysis result
   */
  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return {
    analyzeStory,
    result,
    isLoading,
    error,
    clearResult,
  };
} 