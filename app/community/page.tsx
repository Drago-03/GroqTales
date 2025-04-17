import { CommunityFeed } from "@/components/community-feed";

export const metadata = {
  title: "Community | GroqTales",
  description: "Join the GroqTales community - share stories, connect with other writers and readers, and explore AI-powered storytelling",
};

export default function CommunityPage() {
  return (
    <div className="py-6 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 gradient-heading">GroqTales Community</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow storytellers, share your creative process, and discover amazing stories from around the world.
          </p>
        </div>
      </div>
      <CommunityFeed />
    </div>
  );
} 