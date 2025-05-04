
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AgentType } from "./AIAgent";
import { Trophy } from "lucide-react";

interface CoinTossProps {
  agents: AgentType[];
  onComplete: (winnerId: string) => void;
}

const CoinToss: React.FC<CoinTossProps> = ({ agents, onComplete }) => {
  const [flipping, setFlipping] = useState(false);
  const [winner, setWinner] = useState<AgentType | null>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    startCoinFlip();
  }, []);

  const startCoinFlip = () => {
    if (flipping) return;

    setFlipping(true);
    setWinner(null);
    
    // Generate random number of rotations (5-10 rotations)
    const numRotations = 5 + Math.floor(Math.random() * 5);
    const totalDegrees = numRotations * 360;
    
    // Animate the coin flip
    let currentRotation = 0;
    const flipInterval = setInterval(() => {
      currentRotation += 18; // Speed of rotation
      setRotation(currentRotation);
      
      if (currentRotation >= totalDegrees) {
        clearInterval(flipInterval);
        // Randomly select winner
        const winnerIndex = Math.floor(Math.random() * agents.length);
        setWinner(agents[winnerIndex]);
        setFlipping(false);
        
        // Notify parent component after a short delay
        setTimeout(() => {
          onComplete(agents[winnerIndex].id);
        }, 1500);
      }
    }, 30);
  };

  return (
    <div className="cyber-panel p-6 flex flex-col items-center">
      <h3 className="cyber-text text-xl mb-4 text-center">Bid Tie! Resolving with Coin Toss</h3>
      
      <div className="relative w-32 h-32 mb-8">
        <div 
          className={`coin absolute w-full h-full rounded-full transition-all duration-100 ${flipping ? '' : 'shadow-lg'}`}
          style={{ 
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
            backgroundImage: 'linear-gradient(135deg, #9b87f5 0%, #517fa4 100%)'
          }}
        >
          <div className="coin-face absolute w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-300 backface-visible">
            <span className="text-2xl font-bold">{agents[0].mark}</span>
          </div>
          <div className="coin-face absolute w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-300 backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <span className="text-2xl font-bold">{agents[1].mark}</span>
          </div>
        </div>
      </div>

      {winner && (
        <div className="animate-fade-in flex flex-col items-center">
          <Badge 
            variant="default"
            className="bg-gradient-to-r from-amber-400 to-yellow-500 border-amber-300 text-white font-semibold mb-2 px-4 py-1 text-base shadow-md"
          >
            <Trophy className="h-4 w-4 mr-1" /> WINNER
          </Badge>
          <p className="text-xl cyber-text mt-2">{winner.name} ({winner.mark}) wins the toss!</p>
        </div>
      )}
    </div>
  );
};

export default CoinToss;
