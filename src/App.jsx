// 📁 COMPLETE FILE: src/App.jsx
// 🎯 FIXES: Adds "Copy" button, clears input on submit, provides copy feedback.

import { useState } from "react";
import { marked } from "marked";

function App() {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false); // New state for copy feedback

  const generateStory = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return; // Prevent empty submissions

    setStory("");
    setLoading(true);
    setIsCopied(false); // Reset copy status on new generation

    try {
      const response = await fetch(
        "https://groqtales.netlify.app/.netlify/functions/generate", // Updated to the correct Netlify function endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.body) return;

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
      setStory("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // New function to handle copying text to the clipboard
  const handleCopy = () => {
    if (navigator.clipboard && story) {
      navigator.clipboard.writeText(story).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 font-sans">
      <header className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          GroqTales
        </h1>
        <p className="text-gray-400">
          Unleash your imagination with tales spun by AI at the speed of light.
        </p>
      </header>

      <main className="w-full max-w-3xl">
        <form onSubmit={generateStory} className="flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Tell me a story about a dragon who loves to code..."
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            rows="3"
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
                {/* Copy Button Implementation */}
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm flex items-center gap-1"
                  title="Copy to clipboard"
                >
                  {isCopied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                        <path d="M4 1.5v-1A1.5 1.5 0 0 1 5.5 0h5A1.5 1.5 0 0 1 12 1.5v1H4zM5.5 1a.5.5 0 0 0-.5.5v1h6v-1a.5.5 0 0 0-.5-.5z"/>
                      </svg>
                    </>
                  )}
                </button>
                {/* End Copy Button */}
                
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: marked(story) }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;