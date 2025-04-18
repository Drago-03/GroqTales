import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PenSquare, BookOpen, Sparkles, LightbulbIcon, Share2 } from "lucide-react";

export const metadata = {
  title: "Stories | GroqTales",
  description: "Learn how to create and share your own stories on GroqTales, the Web3 storytelling platform",
};

export default function StoriesPage() {
  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-heading">Create Your Stories</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Unleash your creativity and share your stories with the world. Learn how to create, publish, and monetize your stories on GroqTales.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="theme-gradient-bg text-white border-0 hover:opacity-90">
              <PenSquare className="mr-2 h-5 w-5" />
              Start Writing
            </Button>
            <Button variant="outline" size="lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Browse Examples
            </Button>
          </div>
        </div>

        {/* Why Stories Matter Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Stories Matter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Express Creativity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stories allow you to express your imagination and creativity in ways that connect with others on a deep emotional level.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <LightbulbIcon className="h-5 w-5 mr-2 text-primary" />
                  Preserve Ideas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your unique ideas and perspectives deserve to be preserved and shared with the world. Web3 ensures your stories live forever.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Share2 className="h-5 w-5 mr-2 text-primary" />
                  Build Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stories bring people together, creating communities of like-minded individuals who share your interests and passions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How to Create Stories Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Create Stories</h2>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 aspect-video bg-muted rounded-lg flex items-center justify-center theme-gradient-bg bg-opacity-10">
                <span className="text-2xl font-bold">1</span>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold mb-2">Start with an Idea</h3>
                <p className="text-muted-foreground mb-4">
                  Begin with a concept, character, setting, or plot that inspires you. It doesn't have to be complex – the simplest ideas often make the most compelling stories.
                </p>
                <div className="p-4 border border-border rounded-md bg-muted/20">
                  <p className="text-sm italic">
                    "I start by asking myself: What if? What if a character could read minds? What if technology could predict crimes? These questions spark my creativity." - Featured Writer
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 aspect-video bg-muted rounded-lg flex items-center justify-center theme-gradient-bg bg-opacity-10">
                <span className="text-2xl font-bold">2</span>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold mb-2">Develop Your Draft</h3>
                <p className="text-muted-foreground mb-4">
                  Use our intuitive editor to write your story. Add characters, dialogue, and descriptions. Our AI assistance can help overcome writer's block or suggest plot developments.
                </p>
                <div className="p-4 border border-border rounded-md bg-muted/20">
                  <p className="text-sm italic">
                    "The AI suggestions helped me expand my world-building in ways I hadn't considered. It's like having a creative partner." - Community Member
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3 aspect-video bg-muted rounded-lg flex items-center justify-center theme-gradient-bg bg-opacity-10">
                <span className="text-2xl font-bold">3</span>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold mb-2">Publish and Share</h3>
                <p className="text-muted-foreground mb-4">
                  When you're ready, publish your story to the GroqTales platform. Choose whether to share it freely with the community or mint it as an NFT to monetize your creativity.
                </p>
                <div className="p-4 border border-border rounded-md bg-muted/20">
                  <p className="text-sm italic">
                    "The moment I published my first story and received feedback from readers around the world was absolutely magical." - NFT Creator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-block p-8 rounded-xl theme-gradient-bg bg-opacity-10 border animated-gradient">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Story?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join thousands of storytellers who are sharing their creativity with the world and building a community through the power of Web3.
            </p>
            <Button size="lg" className="theme-gradient-bg text-white border-0 hover:opacity-90">
              <PenSquare className="mr-2 h-5 w-5" />
              Create Your First Story
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 