'use client';

import { Loader2, Upload } from 'lucide-react';
import React, { useState } from 'react';

import StoryAnalysis from '@/components/story-analysis';
import { StoryRecommendations } from '@/components/story-recommendations';
import { StorySummary } from '@/components/story-summary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function StoryToolsPage() {
  const [storyId, setStoryId] = useState('demo-story-' + Date.now());
  const [storyTitle, setStoryTitle] = useState('');
  const [storyGenre, setStoryGenre] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [isLoading, setIsLoading] = useState(false);
  const [summaryKeywords, setSummaryKeywords] = useState<string[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      setStoryContent(text);

      // Try to extract title from first line if not set
      if (!storyTitle) {
        const firstLine = text.split('\n')[0].trim();
        if (firstLine && firstLine.length < 100) {
          setStoryTitle(firstLine);
        }
      }
    } catch (error) {
      console.error('Error reading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummaryGenerated = (summary: any) => {
    if (summary?.keywords) {
      setSummaryKeywords(summary.keywords);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Groq-Powered Story Tools</h1>
          <p className="text-lg text-muted-foreground">
            Analyze, summarize, and get recommendations for your stories with AI
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="editor">Story Editor</TabsTrigger>
            <TabsTrigger value="summary">AI Summary</TabsTrigger>
            <TabsTrigger value="analysis">Story Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Story</CardTitle>
                <CardDescription>
                  Paste your story text or upload a file to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Story Title</label>
                    <Input
                      placeholder="Enter a title for your story"
                      value={storyTitle}
                      onChange={(e) => setStoryTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Genre</label>
                    <Input
                      placeholder="Enter the genre (e.g., Fantasy, Sci-Fi, Romance)"
                      value={storyGenre}
                      onChange={(e) => setStoryGenre(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Story Content</label>
                    <span className="text-xs text-muted-foreground">
                      {storyContent.length} characters
                    </span>
                  </div>
                  <Textarea
                    placeholder="Paste your story here..."
                    className="min-h-[300px]"
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById('file-upload')?.click()
                    }
                    className="flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload Text File
                    <input
                      id="file-upload"
                      type="file"
                      accept=".txt,.md,.rtf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </Button>

                  <Button
                    onClick={() => setActiveTab('summary')}
                    disabled={!storyContent || storyContent.length < 100}
                  >
                    Continue to Summary
                  </Button>
                </div>

                {storyContent && storyContent.length < 100 && (
                  <p className="text-sm text-red-500">
                    Please enter at least 100 characters to use the AI tools
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <StorySummary
              storyId={storyId}
              content={storyContent}
              title={storyTitle || 'Story Summary'}
              onSummaryGenerated={handleSummaryGenerated}
            />

            <div className="flex justify-end mt-4">
              <Button onClick={() => setActiveTab('analysis')}>
                Continue to Analysis
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <StoryAnalysis
              content={storyContent}
              title={storyTitle}
              genre={storyGenre}
            />

            <div className="flex justify-end mt-4">
              <Button onClick={() => setActiveTab('recommendations')}>
                Continue to Recommendations
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <StoryRecommendations
              storyId={storyId}
              content={storyContent}
              keywords={summaryKeywords}
              genre={storyGenre}
              limit={4}
            />

            <div className="flex justify-end mt-4">
              <Button onClick={() => setActiveTab('editor')}>
                Back to Editor
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 p-6 border rounded-xl bg-muted/20">
          <h2 className="text-xl font-semibold mb-4">About These Tools</h2>
          <div className="space-y-4 text-sm">
            <p>
              These writer's tools use Groq's powerful large language models to
              analyze and enhance your stories. The tools process your story
              text to generate summaries, detailed analysis, and find similar
              stories based on themes and content.
            </p>
            <p>
              <strong>AI Summary:</strong> Generates a concise summary of your
              story along with key points, sentiment analysis, and keywords.
            </p>
            <p>
              <strong>Story Analysis:</strong> Provides comprehensive feedback
              on plot structure, character development, themes, and style.
            </p>
            <p>
              <strong>Recommendations:</strong> Suggests similar stories based
              on content, themes, and genre to inspire your writing.
            </p>
            <p className="text-xs text-muted-foreground">
              Note: Your story content is processed through our secure API and
              temporarily stored for analysis purposes. We do not permanently
              store or share your original content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
