
import { AgentType } from "./AIAgent";
import { Trophy, Zap, DollarSign, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

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
  const [animationType, setAnimationType] = useState("animate-shake");
  const [textColor, setTextColor] = useState("text-teal-300/80");
  
  // Trigger shake animation when message changes
  useEffect(() => {
    if (message) {
      // Choose a random animation type
      const animations = ["animate-shake", "animate-chaotic-shake", "animate-slide-shake"];
      const randomAnim = animations[Math.floor(Math.random() * animations.length)];
      
      // Choose a random vibrant color
      const colors = [
        "text-purple-400", 
        "text-cyan-400", 
        "text-pink-400",
        "text-emerald-400",
        "text-amber-400", 
        "text-sky-400",
        "text-rose-400"
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      setTextColor(randomColor);
      setAnimationType(randomAnim);
      setIsShaking(true);
      
      const timer = setTimeout(() => {
        setIsShaking(false);
        // No longer change color back to teal - keep the vibrant color
      }, randomAnim === "animate-slide-shake" ? 1500 : 1200); // Adjust time based on animation
      
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
    ? animationType 
    : "transition-all duration-500 ease-out";

  // Define winner badge style based on win reason
  const getWinnerBadgeStyle = () => {
    if (!winReason) return { variant: "default" as const, className: "" };
    
    switch(winReason) {
      case "pattern":
        return { variant: "default" as const, className: "bg-emerald-500 hover:bg-emerald-600" };
      case "money":
        return { variant: "default" as const, className: "bg-amber-500 hover:bg-amber-600" };
      case "bankrupt":
        return { variant: "default" as const, className: "bg-rose-500 hover:bg-rose-600" };
      default:
        return { variant: "default" as const, className: "" };
    }
  };
  
  return (
    <div className="text-center mb-4">
      <h2 className={statusClass}>
        {statusIcon}
        {statusText}
        
        {/* Winner Badge */}
        {status === "gameOver" && winner && (
          <Badge 
            variant={getWinnerBadgeStyle().variant}
            className={`ml-2 text-white animate-pulse-glow ${getWinnerBadgeStyle().className}`}
          >
            WINNER
          </Badge>
        )}
      </h2>
      
      {message && (
        <div 
          key={messageKey} 
          className={`mt-1 ${textColor} ${messageAnimClass} ${isMobile ? 'text-sm' : ''} font-medium`}
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
