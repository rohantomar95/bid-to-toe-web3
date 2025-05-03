
import { AgentType } from "./AIAgent";
import { Trophy, Zap, DollarSign, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

interface GameStatusProps {
  status: "bidding" | "playing" | "gameOver";
  winner: AgentType | null;
  winReason: "pattern" | "money" | "bankrupt" | null;
  turn: number;
  currentPlayer: AgentType | null;
  message?: string;
  messageKey?: number; // Add a key prop to trigger animations
}

const GameStatus = ({ status, winner, winReason, turn, currentPlayer, message, messageKey }: GameStatusProps) => {
  let statusText = "";
  let statusClass = "text-xl cyber-text";
  let statusIcon = null;
  const isMobile = useIsMobile();
  
  // Animation state
  const [isShaking, setIsShaking] = useState(false);
  
  // Trigger shake animation when message changes
  useEffect(() => {
    if (message) {
      setIsShaking(true);
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 1000); // Shake for 1 second
      
      return () => clearTimeout(timer);
    }
  }, [messageKey]);
  
  if (status === "bidding") {
    statusText = "Bidding Phase";
    statusClass += " text-teal-500";
    statusIcon = <DollarSign className="w-6 h-6 inline-block mr-2 text-teal-500 animate-pulse" />;
  } else if (status === "playing") {
    statusText = `Turn ${turn} - ${currentPlayer?.name}'s Move`;
    statusClass += " text-teal-400";
    statusIcon = <Zap className="w-6 h-6 inline-block mr-2 text-teal-400" />;
  } else if (status === "gameOver" && winner) {
    statusText = `${winner.name} Wins!`;
    statusClass += " text-teal-300 font-bold text-2xl";
    statusIcon = <Trophy className="w-6 h-6 inline-block mr-2 text-teal-300" />;
  }
  
  if (isMobile) {
    statusClass = statusClass.replace("text-xl", "text-lg").replace("text-2xl", "text-xl");
  }
  
  // Define the message animation class
  const messageAnimClass = isShaking 
    ? "animate-shake" 
    : "transition-all duration-500 ease-out";
  
  return (
    <div className="text-center mb-4">
      <h2 className={statusClass}>
        {statusIcon}
        {statusText}
      </h2>
      
      {message && (
        <div 
          key={messageKey} 
          className={`mt-1 text-teal-300/80 ${messageAnimClass} ${isMobile ? 'text-sm' : ''}`}
        >
          {message}
        </div>
      )}
      
      {status === "gameOver" && winner && winReason && (
        <div className={`mt-2 text-muted-foreground animate-fade-in ${isMobile ? 'text-xs' : ''}`}>
          {winReason === "pattern" && "Victory by completing a line!"}
          {winReason === "money" && "Victory with more remaining funds!"}
          {winReason === "bankrupt" && "Victory by bankrupting opponent!"}
        </div>
      )}
    </div>
  );
};

export default GameStatus;
