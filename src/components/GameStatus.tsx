
import { AgentType } from "./AIAgent";
import { Trophy, Zap, DollarSign, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface GameStatusProps {
  status: "bidding" | "playing" | "gameOver";
  winner: AgentType | null;
  winReason: "pattern" | "money" | "bankrupt" | null;
  turn: number;
  currentPlayer: AgentType | null;
  message?: string;
}

const GameStatus = ({ status, winner, winReason, turn, currentPlayer, message }: GameStatusProps) => {
  let statusText = "";
  let statusClass = "text-xl cyber-text";
  let statusIcon = null;
  const isMobile = useIsMobile();
  
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
  
  return (
    <div className="text-center mb-4">
      <h2 className={statusClass}>
        {statusIcon}
        {statusText}
      </h2>
      
      {message && (
        <div className={`mt-1 text-teal-300/80 animate-fade-in ${isMobile ? 'text-sm' : ''}`}>
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
