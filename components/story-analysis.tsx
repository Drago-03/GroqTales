"use client";

import { useState } from "react";
import { useStoryAnalysis } from "@/hooks/use-story-analysis";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, RefreshCw, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface StoryAnalysisProps {
  content: string;
  title?: string;
  genre?: string;
  apiKey?: string;
  className?: string;
  onAnalysisComplete?: (result: any) => void;
}

export function StoryAnalysis({
  content,
  title,
  genre,
  apiKey,
  className,
  onAnalysisComplete
}: StoryAnalysisProps) {
  const { analyzeStory, result, isLoading, error, clearResult } = useStoryAnalysis();
  const [analysisType, setAnalysisType] = useState<'standard' | 'critique' | 'audience' | 'development'>('standard');
  const [activeTab, setActiveTab] = useState<string>("plot");
  const { toast } = useToast();

  const analysisTypes = [
    { value: 'standard', label: 'Standard Analysis', description: 'Complete literary analysis covering plot, characters, themes, and style' },
    { value: 'critique', label: 'Critical Feedback', description: 'Constructive critique focusing on strengths and areas for improvement' },
    { value: 'audience', label: 'Audience Analysis', description: 'Target demographic and market positioning assessment' },
    { value: 'development', label: 'Developmental Edit', description: 'Detailed editing feedback for story improvement' }
  ];

  const handleAnalyze = async () => {
    clearResult();
    
    const analysisResult = await analyzeStory({
      content,
      title,
      genre,
      analysisType,
      apiKey
    });
    
    if (analysisResult) {
      toast({
        title: "Analysis Complete",
        description: `${analysisTypes.find(t => t.value === analysisType)?.label} has been generated.`,
        variant: "default",
      });
      
      // Set the initial active tab based on analysis type
      switch (analysisType) {
        case 'standard':
          setActiveTab("plot");
          break;
        case 'critique':
          setActiveTab("overall");
          break;
        case 'audience':
          setActiveTab("demographics");
          break;
        case 'development':
          setActiveTab("structure");
          break;
      }
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      }
    } else if (error) {
      toast({
        title: "Analysis Failed",
        description: error,
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    const analysisData = result.format === 'json' ? result.analysis : { rawText: result.analysis.rawText };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${title || 'story'}-analysis.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Analysis Downloaded",
      description: "The analysis has been saved as a JSON file.",
      variant: "default",
    });
  };

  const renderAnalysisContent = () => {
    if (!result || !result.analysis) return null;
    
    // Handle raw text format
    if (result.format === 'text') {
      return (
        <div className="whitespace-pre-line">
          {result.analysis.rawText}
        </div>
      );
    }
    
    // Handle JSON format based on analysis type
    const analysis = result.analysis;
    
    switch (result.analysisType) {
      case 'standard':
        return (
          <Tabs defaultValue="plot" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="plot">Plot</TabsTrigger>
              <TabsTrigger value="characters">Characters</TabsTrigger>
              <TabsTrigger value="themes">Themes</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="improvements">Improvements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="plot" className="space-y-4">
              <h3 className="text-lg font-semibold">Plot Structure</h3>
              <div className="whitespace-pre-line">{analysis["Plot Structure"]}</div>
            </TabsContent>
            
            <TabsContent value="characters" className="space-y-4">
              <h3 className="text-lg font-semibold">Character Analysis</h3>
              <div className="whitespace-pre-line">{analysis["Character Analysis"]}</div>
            </TabsContent>
            
            <TabsContent value="themes" className="space-y-4">
              <h3 className="text-lg font-semibold">Theme Analysis</h3>
              <div className="whitespace-pre-line">{analysis["Theme Analysis"]}</div>
            </TabsContent>
            
            <TabsContent value="style" className="space-y-4">
              <h3 className="text-lg font-semibold">Stylistic Elements</h3>
              <div className="whitespace-pre-line">{analysis["Stylistic Elements"]}</div>
            </TabsContent>
            
            <TabsContent value="strengths" className="space-y-4">
              <h3 className="text-lg font-semibold">Strengths</h3>
              <div className="whitespace-pre-line">{analysis["Strengths"]}</div>
            </TabsContent>
            
            <TabsContent value="improvements" className="space-y-4">
              <h3 className="text-lg font-semibold">Areas for Improvement</h3>
              <div className="whitespace-pre-line">{analysis["Areas for Improvement"]}</div>
            </TabsContent>
          </Tabs>
        );
        
      case 'critique':
        return (
          <Tabs defaultValue="overall" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="improvements">Improvements</TabsTrigger>
              <TabsTrigger value="mechanics">Mechanics</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overall" className="space-y-4">
              <h3 className="text-lg font-semibold">Overall Impression</h3>
              <div className="whitespace-pre-line">{analysis["Overall Impression"]}</div>
            </TabsContent>
            
            <TabsContent value="strengths" className="space-y-4">
              <h3 className="text-lg font-semibold">Strongest Elements</h3>
              <div className="whitespace-pre-line">{analysis["Strongest Elements"]}</div>
            </TabsContent>
            
            <TabsContent value="improvements" className="space-y-4">
              <h3 className="text-lg font-semibold">Areas for Improvement</h3>
              <div className="whitespace-pre-line">{analysis["Areas for Improvement"]}</div>
            </TabsContent>
            
            <TabsContent value="mechanics" className="space-y-4">
              <h3 className="text-lg font-semibold">Writing Mechanics</h3>
              <div className="whitespace-pre-line">{analysis["Writing Mechanics"]}</div>
            </TabsContent>
            
            <TabsContent value="engagement" className="space-y-4">
              <h3 className="text-lg font-semibold">Reader Engagement</h3>
              <div className="whitespace-pre-line">{analysis["Reader Engagement"]}</div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-4">
              <h3 className="text-lg font-semibold">Specific Recommendations</h3>
              <div className="whitespace-pre-line">{analysis["Specific Recommendations"]}</div>
            </TabsContent>
          </Tabs>
        );
        
      case 'audience':
        return (
          <Tabs defaultValue="demographics" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="positioning">Positioning</TabsTrigger>
              <TabsTrigger value="appeal">Appeal</TabsTrigger>
              <TabsTrigger value="comparisons">Comparisons</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="expansion">Expansion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demographics" className="space-y-4">
              <h3 className="text-lg font-semibold">Target Demographics</h3>
              <div className="whitespace-pre-line">{analysis["Target Demographics"]}</div>
            </TabsContent>
            
            <TabsContent value="positioning" className="space-y-4">
              <h3 className="text-lg font-semibold">Market Positioning</h3>
              <div className="whitespace-pre-line">{analysis["Market Positioning"]}</div>
            </TabsContent>
            
            <TabsContent value="appeal" className="space-y-4">
              <h3 className="text-lg font-semibold">Reader Appeal</h3>
              <div className="whitespace-pre-line">{analysis["Reader Appeal"]}</div>
            </TabsContent>
            
            <TabsContent value="comparisons" className="space-y-4">
              <h3 className="text-lg font-semibold">Comparisons</h3>
              <div className="whitespace-pre-line">{analysis["Comparisons"]}</div>
            </TabsContent>
            
            <TabsContent value="marketing" className="space-y-4">
              <h3 className="text-lg font-semibold">Marketing Angles</h3>
              <div className="whitespace-pre-line">{analysis["Marketing Angles"]}</div>
            </TabsContent>
            
            <TabsContent value="expansion" className="space-y-4">
              <h3 className="text-lg font-semibold">Audience Expansion</h3>
              <div className="whitespace-pre-line">{analysis["Audience Expansion"]}</div>
            </TabsContent>
          </Tabs>
        );
        
      case 'development':
        return (
          <Tabs defaultValue="structure" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="characters">Characters</TabsTrigger>
              <TabsTrigger value="setting">Setting</TabsTrigger>
              <TabsTrigger value="dialogue">Dialogue</TabsTrigger>
              <TabsTrigger value="tension">Tension</TabsTrigger>
              <TabsTrigger value="nextsteps">Next Steps</TabsTrigger>
            </TabsList>
            
            <TabsContent value="structure" className="space-y-4">
              <h3 className="text-lg font-semibold">Story Structure</h3>
              <div className="whitespace-pre-line">{analysis["Story Structure"]}</div>
            </TabsContent>
            
            <TabsContent value="characters" className="space-y-4">
              <h3 className="text-lg font-semibold">Character Development</h3>
              <div className="whitespace-pre-line">{analysis["Character Development"]}</div>
            </TabsContent>
            
            <TabsContent value="setting" className="space-y-4">
              <h3 className="text-lg font-semibold">Setting & Worldbuilding</h3>
              <div className="whitespace-pre-line">{analysis["Setting & Worldbuilding"]}</div>
            </TabsContent>
            
            <TabsContent value="dialogue" className="space-y-4">
              <h3 className="text-lg font-semibold">Dialogue & Voice</h3>
              <div className="whitespace-pre-line">{analysis["Dialogue & Voice"]}</div>
            </TabsContent>
            
            <TabsContent value="tension" className="space-y-4">
              <h3 className="text-lg font-semibold">Tension & Conflict</h3>
              <div className="whitespace-pre-line">{analysis["Tension & Conflict"]}</div>
            </TabsContent>
            
            <TabsContent value="nextsteps" className="space-y-4">
              <h3 className="text-lg font-semibold">Next Steps</h3>
              <div className="whitespace-pre-line">{analysis["Next Steps"]}</div>
            </TabsContent>
          </Tabs>
        );
        
      default:
        return (
          <div className="whitespace-pre-line">
            {JSON.stringify(analysis, null, 2)}
          </div>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Story Analysis
        </CardTitle>
        <CardDescription>
          AI-powered literary analysis and feedback powered by Groq
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Analyzing story...</span>
          </div>
        ) : !result ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Type</label>
              <Select 
                value={analysisType} 
                onValueChange={(value) => setAnalysisType(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select analysis type" />
                </SelectTrigger>
                <SelectContent>
                  {analysisTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex flex-col gap-1">
                        <span>{type.label}</span>
                        <span className="text-xs text-muted-foreground">{type.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This analysis will process approximately {Math.min(content.length, 8000).toLocaleString()} characters 
                of your story to provide detailed insights and feedback.
              </p>
              
              {content.length > 8000 && (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                  Note: Only the first 8,000 characters will be analyzed
                </Badge>
              )}
            </div>
            
            <Button 
              onClick={handleAnalyze} 
              className="w-full"
              disabled={!content || content.length < 100}
            >
              Generate Analysis
            </Button>
            
            {(!content || content.length < 100) && (
              <p className="text-sm text-red-500">
                Please provide at least 100 characters of content to analyze
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {analysisTypes.find(t => t.value === result.analysisType)?.label || 'Analysis'}
              </Badge>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download JSON
              </Button>
            </div>
            
            {renderAnalysisContent()}
          </div>
        )}
      </CardContent>
      
      {result && (
        <CardFooter className="flex justify-between">
          <span className="text-xs text-muted-foreground">
            Analyzed {Math.min(content.length, 8000).toLocaleString()} characters
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 