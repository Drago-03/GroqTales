// ✍️ PASTE THIS INTO: src/App.jsx

import CreateAiStoryPage from '../app/create/ai-story/page';

function App() {
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
        {/* This just renders your new page */}
        <CreateAiStoryPage />
      </main>
    </div>
  );
}

export default App;