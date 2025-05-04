
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AgentType } from "./AIAgent";
import { Trophy, Coin } from "lucide-react";

interface CoinTossProps {
  agents: AgentType[];
  onComplete: (winnerId: string) => void;
}

const CoinToss: React.FC<CoinTossProps> = ({ agents, onComplete }) => {
  const [flipping, setFlipping] = useState(false);
  const [winner, setWinner] = useState<AgentType | null>(null);
  const [rotation, setRotation] = useState(0);
  const [tosses, setTosses] = useState(0);
  const [commentary, setCommentary] = useState("Resolving tie with a coin toss...");

  useEffect(() => {
    startCoinFlip();
  }, []);

  const startCoinFlip = () => {
    if (flipping) return;

    setFlipping(true);
    setWinner(null);
    
    // Set initial commentary
    setCommentary("Both agents bid the same amount! Initiating coin toss protocol...");
    
    // Generate random number of rotations (3-6 rotations for slower animation)
    const numRotations = 3 + Math.floor(Math.random() * 3);
    const totalDegrees = numRotations * 360;
    
    // Animate the coin flip with slower rotation
    let currentRotation = 0;
    const flipInterval = setInterval(() => {
      currentRotation += 9; // Reduced speed (was 18)
      setRotation(currentRotation);
      
      // Count the number of tosses (full 360 degree rotations)
      if (currentRotation % 360 === 0) {
        const newTosses = currentRotation / 360;
        setTosses(newTosses);
        
        // Update commentary based on toss count
        if (newTosses === 1) {
          setCommentary("First toss... the tension builds!");
        } else if (newTosses === 2) {
          setCommentary("Second toss... agents analyzing probabilities!");
        } else if (newTosses < numRotations) {
          setCommentary(`Toss #${newTosses}... quantum algorithms at work!`);
        }
      }
      
      if (currentRotation >= totalDegrees) {
        clearInterval(flipInterval);
        // Randomly select winner
        const winnerIndex = Math.floor(Math.random() * agents.length);
        const selectedWinner = agents[winnerIndex];
        setWinner(selectedWinner);
        setFlipping(false);
        
        // Final commentary
        setCommentary(`${selectedWinner.name} wins the toss with ${selectedWinner.mark}!`);
        
        // Notify parent component after a longer delay
        setTimeout(() => {
          onComplete(selectedWinner.id);
        }, 2500);
      }
    }, 60); // Increased interval from 30ms to 60ms for slower animation
  };

  return (
    <div className="cyber-panel absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-10 bg-slate-900/80 backdrop-blur-sm">
      <div className="max-w-md w-full p-6 flex flex-col items-center">
        <h3 className="cyber-text text-xl mb-4 text-center">
          <Coin className="h-5 w-5 inline-block mr-2 text-amber-400" />
          Coin Toss Tie Breaker!
        </h3>
        
        <div className={`relative w-40 h-40 mb-8 ${flipping ? 'animate-bounce-subtle' : ''}`}>
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

        {flipping ? (
          <div className="text-base text-cyan-400 animate-pulse mb-4">
            <span className="mr-2 font-bold">Toss #{tosses}</span>
            <span className="text-sm">{tosses % 2 === 0 ? agents[0].mark : agents[1].mark} is showing</span>
          </div>
        ) : null}

        <div className="animate-pulse text-center mb-4 text-white">
          {commentary}
        </div>

        {winner && (
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
