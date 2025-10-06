import { useState } from "react";

const CopyButton = ({ textToCopy, className = "" }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy) return; // don't copy empty text
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-4 py-2 rounded border transition-colors ${className} ${
        isCopied ? "bg-green-500 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {isCopied ? "Copied!" : "Copy"}
    </button>
  );
};

export default CopyButton;
