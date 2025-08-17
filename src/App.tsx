import { useState } from "react";
import "./App.css";

function App() {
  // List of expression emojis for reactions
  const emojis = [
    "😂",
    "😆",
    "😅",
    "🤣",
    "😊",
    "😎",
    "😍",
    "🥰",
    "😘",
    "😋",
    "🤔",
    "🧐",
    "😮",
    "😲",
    "😳",
    "🥺",
    "😢",
    "😭",
    "😠",
    "😡",
    "🤬",
    "🤢",
    "🤮",
    "😱",
    "😵",
    "🥴",
    "🤪",
    "😜",
    "🙄",
    "😬",
  ];

  // Emoji categories
  const categories = {
    happy: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😊", "😇"],
    love: ["😍", "🥰", "😘", "😗", "😙", "😚", "😻", "💘", "💝", "💖", "💗"],
    sad: ["😢", "😭", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫"],
    angry: ["😠", "😡", "🤬", "👿", "😤", "😾", "💢", "💥"],
    surprised: ["😮", "😲", "😯", "😦", "😧", "😨", "😱", "🙀"],
    disgusted: ["🤢", "🤮", "😖", "😫", "😩", "😤"],
    funny: ["🤪", "😜", "😝", "😛", "😋", "🤣", "😂", "😹"],
    confused: ["🤔", "🧐", "😕", "😟", "🤨", "🙄", "😒", "😑"],
  };

  // State variables
  const [currentEmoji, setCurrentEmoji] = useState<string>("🎬");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllEmojis, setShowAllEmojis] = useState<boolean>(false);

  // State for slot machine animation
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinningEmojis, setSpinningEmojis] = useState<string[]>([]);
  
  // Function to select a random emoji with slot machine animation
  const selectRandomEmoji = () => {
    // Start spinning animation
    setIsSpinning(true);
    setSelectedCategory(null);
    setShowAllEmojis(false);
    
    // Create a random sequence of emojis for the animation
    // We use the same emoji set as the main display for consistency
    const shuffledEmojis = [...emojis]
      .sort(() => Math.random() - 0.5) // Shuffle the array
      .slice(0, 20); // Take 20 random emojis for a longer animation sequence
    
    setSpinningEmojis(shuffledEmojis);
    
    // Animation timing variables
    const spinDuration = 2000; // Total animation time in ms
    
    // Stop the animation after the duration and set the final emoji
    setTimeout(() => {
      const finalEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      setCurrentEmoji(finalEmoji);
      setIsSpinning(false);
    }, spinDuration);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowAllEmojis(false);

    // Pick a random emoji from the selected category
    const categoryEmojis = categories[category as keyof typeof categories];
    const randomIndex = Math.floor(Math.random() * categoryEmojis.length);
    setCurrentEmoji(categoryEmojis[randomIndex]);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setCurrentEmoji(emoji);
    setShowAllEmojis(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white flex flex-col items-center justify-center p-4">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold mb-2">Reaction Emoji Selector</h1>
        <p className="text-xl opacity-80">
          Pick an expression for your reaction videos!
        </p>
      </header>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-md flex flex-col items-center shadow-lg">
        {/* Slot Machine Display */}
        {isSpinning ? (
          <div className="mb-6 flex justify-center items-center">
            <div className="relative w-[150px] h-[150px] overflow-hidden rounded-full bg-black/15 shadow-[inset_0_0_15px_rgba(0,0,0,0.3)]">
              <div 
                className="absolute top-0 left-0 w-full h-[200%] flex flex-col items-center" 
                style={{
                  animation: `slotMachine 0.8s linear infinite`
                }}
              >
                {/* We duplicate the emoji list to create a continuous loop */}
                {[...spinningEmojis, ...spinningEmojis].map((emoji, index) => (
                  <div key={index} className="flex items-center justify-center w-full h-[150px] text-[100px]">
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="absolute top-0 left-0 w-full h-full shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] rounded-full pointer-events-none z-10"></div>
            </div>
          </div>
        ) : (
          <div
            className="text-9xl mb-6 transition-all hover:scale-110 cursor-pointer"
            onClick={() => !isSpinning && setShowAllEmojis(!showAllEmojis)}>
            {currentEmoji}
          </div>
        )}

        {/* Controls */}
        <div className="w-full flex flex-col gap-4">
          <button
            onClick={selectRandomEmoji}
            disabled={isSpinning}
            className={`${
              isSpinning
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors`}>
            {isSpinning ? "Spinning..." : "Random Expression"}
          </button>

          <div className="flex flex-wrap gap-2 justify-center">
            {Object.keys(categories).map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-white/20 hover:bg-white/30"
                }`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Emoji Grid (when showAllEmojis is true) */}
        {showAllEmojis && (
          <div className="mt-6 w-full">
            <h3 className="text-lg font-bold mb-2">All Expressions:</h3>
            <div className="grid grid-cols-6 gap-2">
              {emojis.map((emoji, index) => (
                <div
                  key={index}
                  className="text-2xl cursor-pointer hover:bg-white/20 p-2 rounded-md flex items-center justify-center transition-colors"
                  onClick={() => handleEmojiSelect(emoji)}>
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Emoji Grid (when a category is selected) */}
        {selectedCategory && (
          <div className="mt-6 w-full">
            <h3 className="text-lg font-bold mb-2">
              {selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1)}{" "}
              Expressions:
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {categories[selectedCategory as keyof typeof categories].map(
                (emoji, index) => (
                  <div
                    key={index}
                    className="text-2xl cursor-pointer hover:bg-white/20 p-2 rounded-md flex items-center justify-center transition-colors"
                    onClick={() => handleEmojiSelect(emoji)}>
                    {emoji}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center max-w-md">
        <p className="text-sm opacity-70">
          Click on the big emoji to show all options, or use the category
          buttons to filter expressions. Perfect for reaction videos!
        </p>
      </div>

      <footer className="mt-6 text-center opacity-70 text-sm">
        <p>Made for reaction YouTubers</p>
      </footer>
    </div>
  );
}

export default App;
