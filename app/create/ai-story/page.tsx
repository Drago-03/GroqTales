// ✍️ PASTE THIS COMPLETE CODE INTO: app/create/ai-story/page.tsx

"use client"; // This tells the framework this is an interactive component

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

export default function CreateAiStoryPage() {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // ✅ FIX 1: Added the correct type for the form event 'e'
  const generateStory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setStory("");
    setLoading(true);
    setIsCopied(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullStory = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullStory += chunk;
        setStory(fullStory);
      }
    } catch (error) {
      console.error("Failed to generate story:", error);
      setStory("Sorry, something went wrong. Please check the console and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard && story) {
      navigator.clipboard.writeText(story).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={generateStory} className="flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A dragon who loves to code..."
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
          // ✅ FIX 2: Changed rows="3" (string) to rows={3} (number)
          rows={3}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300"
        >
          {loading ? "Generating..." : "Generate Story"}
        </button>
      </form>

      {story && (
        <div className="mt-8 bg-gray-800 rounded-lg p-1 relative">
          <div className="p-4">
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm flex items-center gap-1 z-10"
              title="Copy to clipboard"
            >
              {isCopied ? "Copied!" : "Copy"}
            </button>

            <div className="prose prose-invert max-w-none">
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                {story}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}