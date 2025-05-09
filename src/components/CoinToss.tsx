
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AgentType } from "./AIAgent";
import { Trophy, Coins } from "lucide-react";

interface CoinTossProps {
  agents: AgentType[];
  onComplete: (winnerId: string) => void;
}

const CoinToss: React.FC<CoinTossProps> = ({ agents, onComplete }) => {
  const [flipping, setFlipping] = useState(false);
  const [winner, setWinner] = useState<AgentType | null>(null);
  const [rotation, setRotation] = useState(0);
  const [commentary, setCommentary] = useState("Resolving tie with a coin toss...");
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    startCoinFlip();
  }, []);

  const startCoinFlip = () => {
    if (flipping) return;

    setFlipping(true);
    setWinner(null);
    setShowResult(false);
    
    // Set initial commentary
    setCommentary("Both agents bid the same amount! Initiating coin toss protocol...");
    
    // Single full rotation (plus a little extra for effect)
    const totalDegrees = 380;
    
    // Randomly select winner before animation
    const winnerIndex = Math.floor(Math.random() * agents.length);
    const selectedWinner = agents[winnerIndex];
    
    // Determine final rotation to end on winner's face
    // If winner is X (index 0), end with X showing (even number of 180° rotations)
    // If winner is O (index 1), end with O showing (odd number of 180° rotations)
    let adjustedTotalDegrees = totalDegrees;
    const isXWinner = winnerIndex === 0;
    const shouldEndOnEvenRotation = isXWinner; // X should show if total rotations is even
    
    const isCurrentlyEvenRotation = Math.floor(adjustedTotalDegrees / 180) % 2 === 0;
    if (shouldEndOnEvenRotation !== isCurrentlyEvenRotation) {
      // Add 180 more degrees to flip to the correct side
      adjustedTotalDegrees += 180;
    }
    
    // Animate the coin flip
    let currentRotation = 0;
    const flipInterval = setInterval(() => {
      currentRotation += 10; // Speed adjusted for single flip
      setRotation(currentRotation);
      
      // Update commentary
      if (currentRotation > adjustedTotalDegrees / 3) {
        setCommentary("Coin is flipping...");
      }
      
      if (currentRotation >= adjustedTotalDegrees) {
        clearInterval(flipInterval);
        setWinner(selectedWinner);
        setFlipping(false);
        
        // Shows the settled coin with winner's mark
        setShowResult(true);
        
        // Final commentary
        setCommentary(`${selectedWinner.name} wins the toss with ${selectedWinner.mark}!`);
        
        // Notify parent component after a delay to allow user to see the result
        setTimeout(() => {
          onComplete(selectedWinner.id);
        }, 2500);
      }
    }, 30); // Faster interval for smoother animation
  };

  return (
    <div className="cyber-panel absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-10 bg-slate-900/80 backdrop-blur-sm">
      <div className="max-w-md w-full p-6 flex flex-col items-center">
        <h3 className="cyber-text text-xl mb-4 text-center">
          <Coins className="h-5 w-5 inline-block mr-2 text-amber-400" />
          Coin Toss Tie Breaker!
        </h3>
        
        <div className={`relative w-40 h-40 mb-8 ${flipping ? 'animate-bounce-subtle' : showResult ? 'animate-scale-in' : ''}`}>
          <div 
            className={`coin absolute w-full h-full rounded-full transition-all duration-100 ${flipping ? '' : 'shadow-lg'}`}
            style={{ 
              transformStyle: 'preserve-3d',
              transform: `rotateY(${rotation}deg)`,
              backgroundImage: 'linear-gradient(135deg, #9b87f5 0%, #517fa4 100%)'
            }}
          >
            <div className="coin-face absolute w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-300 backface-visible">
              <span className="text-4xl font-bold">{agents[0].mark}</span>
            </div>
            <div className="coin-face absolute w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-300 backface-hidden"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <span className="text-4xl font-bold">{agents[1].mark}</span>
            </div>
          </div>
        </div>

        <div className={`text-center mb-4 text-white ${flipping ? 'animate-pulse' : ''}`}>
          {commentary}
        </div>

        {winner && showResult && (
          <div className="animate-fade-in flex flex-col items-center">
            <Badge 
              variant="default"
              className="bg-gradient-to-r from-amber-400 to-yellow-500 border-amber-300 text-white font-semibold mb-2 px-4 py-1 text-base shadow-md"
            >
              <Trophy className="h-4 w-4 mr-1" /> WINNER
            </Badge>
            <p className="text-xl cyber-text mt-2">{winner.name} ({winner.mark}) will move first!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinToss;
