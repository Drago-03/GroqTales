"use client";

import React from "react";


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
  /** Story content to analyze */
  content: string;
  /** Optional story title */
  title?: string;
  /** Optional story genre */
  genre?: string;
  /** Optional API key for analysis service */
  apiKey?: string;
  /** Optional CSS class name */
  className?: string;
  /** Callback fired when analysis completes */
  onAnalysisComplete?: (result: any) => void;
}
