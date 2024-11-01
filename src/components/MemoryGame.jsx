import { useEffect, useState } from "react";

const MemoryGame = () => {
  // State for the grid size, default is 4x4 grid
  const [gridSize, setGridSize] = useState(4);
  
  // State to store the array of cards
  const [cards, setCards] = useState([]);

  // State to track flipped cards, solved pairs, and whether the board is disabled (to prevent rapid clicks)
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  // State to track if the player has won the game
  const [won, setWon] = useState(false);

  // Handles changes to grid size input, updates if size is between 2 and 10
  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  const initializeGame = () => {
    // Calculate total number of cards on the board (e.g., 16 for a 4x4 grid)
    const totalCards = gridSize * gridSize; // 16

    // Calculate the number of pairs (half of the total cards, e.g., 8 pairs)
    const pairCount = Math.floor(totalCards / 2); // 8

    // Create an array of unique numbers for each pair, e.g., [1, 2, ..., 8]
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);

    // Duplicate numbers array to create pairs, shuffle, and limit to totalCards
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    // Initialize game state: shuffled cards, empty flipped and solved arrays, game not won
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
  };

  // Runs initializeGame whenever gridSize changes
  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    // Checks if the flipped cards match
    if (cards[firstId].number === cards[secondId].number) {
      // If match, add both card IDs to solved array
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      // If not a match, unflip the cards after a delay
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  const handleClick = (id) => {
    // Prevents clicks if the board is disabled or the game is won
    if (disabled || won) return;

    // First click on a card: flip it
    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    // Second click on a card
    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        // Flip the second card and check for a match
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        // If clicked the same card, unflip and re-enable clicking
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  // Checks if a card is flipped by seeing if it’s in the flipped or solved arrays
  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  
  // Checks if a card is solved by seeing if it’s in the solved array
  const isSolved = (id) => solved.includes(id);

  // Watches solved cards array, sets won to true if all cards are solved
  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-200 p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
      
      {/* Grid Size Input */}
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2">
          Grid Size: (max 10)
        </label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={gridSize}
          onChange={handleGridSizeChange}
          className="border-2 border-gray-300 rounded px-2 py-1"
        />
      </div>

      {/* Game Board */}
      <div
        className={`grid gap-2 mb-4`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300  ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-400"
              }`}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          );
        })}
      </div>

      {/* Result Message */}
      {won && (
        <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
          You Won!
        </div>
      )}

      {/* Reset / Play Again Button */}
      <button
        onClick={initializeGame}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;
