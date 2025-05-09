
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DollarSign, BadgeCheck, Trophy, X, Circle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export type AgentType = {
  id: string;
  name: string;
  avatar: string;
  money: number;
  mark: "X" | "O";
  lastBid: number | null;
};

interface AIAgentProps {
  agent: AgentType;
  isActive: boolean;
  isBidWinner: boolean | null;
  showLastBid: boolean;
  isGameOver?: boolean;
  isWinner?: boolean;
  activeBidding?: boolean; // Add new prop for active bidding state
}

const AIAgent = ({ 
  agent, 
  isActive, 
  isBidWinner, 
  showLastBid, 
  isGameOver = false,
  isWinner = false,
  activeBidding = false
}: AIAgentProps) => {
  const isMobile = useIsMobile();
  const statusColor = isActive ? "bg-teal-500" : "bg-muted";
  
  // Only apply the pulse animation when ALL of these conditions are met:
  // 1. Not in active bidding phase
  // 2. Not game over
  // 3. This agent is the bid winner
  const bidWinnerStyle = !activeBidding && !isGameOver && isBidWinner === true 
    ? "cyber-border animate-pulse-glow" 
    : isBidWinner === false && !isGameOver && !activeBidding
      ? "opacity-70" 
      : "";

  // Special winner styling for game over state
  const winnerStyle = isWinner 
    ? "winner-card border-2 border-amber-400 shadow-lg shadow-amber-300/20" 
    : "";

  const getProgressColor = () => {
    if (agent.money <= 20) return "bg-amber-500";
    return "bg-teal-500";
  };

  // Get the background color, icon, and text color based on the agent's mark
  const getMarkerStyles = () => {
    if (agent.mark === "X") {
      return {
        bgColor: "bg-teal-500",
        textColor: "text-white",
        Icon: X
      };
    } else {
      return {
        bgColor: "bg-amber-500",
        textColor: "text-white",
        Icon: Circle
      };
    }
  };

  const { bgColor, textColor, Icon } = getMarkerStyles();

  return (
    <div className={`cyber-panel flex flex-col items-center p-4 transition-all duration-300 ${bidWinnerStyle} ${winnerStyle} relative`}>
      {/* Mark indicator in the top-left corner */}
      <div className={`absolute top-0 left-0 ${bgColor} rounded-br-lg px-2.5 py-1.5 shadow-md flex items-center justify-center z-10`}>
        <Icon className={`${textColor} w-4 h-4`} strokeWidth={3} />
      </div>

      <div className="relative mb-2">
        <Avatar className={`${isMobile ? 'w-14 h-14' : 'w-20 h-20'} border-2 ${isWinner ? "border-amber-400" : "border-teal-500/50"}`}>
          <img 
            src={agent.avatar} 
            alt={agent.name}
            className="object-cover"
          />
        </Avatar>
        <div className={`absolute top-0 right-0 w-4 h-4 rounded-full ${statusColor} border border-white`}></div>
        
        {/* Winner badge with trophy icon */}
        {isWinner && (
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full p-1.5 shadow-lg border border-amber-200">
            <Trophy className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      <h3 className={`cyber-text ${isMobile ? 'text-lg' : 'text-xl'} font-bold text-center mb-1 ${isWinner ? "text-amber-400" : ""}`}>
        {agent.name}
      </h3>
      <div className="text-sm text-muted-foreground mb-2">Agent {agent.mark}</div>

      {/* Winner badge at top */}
      {isWinner && (
        <Badge 
          variant="outline" 
          className="bg-gradient-to-r from-amber-400 to-yellow-500 border-amber-300 text-white font-semibold mb-2 px-3 shadow-md"
        >
          CHAMPION
        </Badge>
      )}

      <div className="w-full mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-muted-foreground">Balance</span>
          <span className="cyber-text flex items-center">
            <DollarSign className="w-4 h-4 mr-1 text-teal-500" />
            <span className={`${agent.money <= 20 ? "text-amber-500" : "text-teal-400"}`}>
              {agent.money}
            </span>
          </span>
        </div>
        <Progress 
          value={agent.money} 
          max={100} 
          className="h-2 bg-slate-800"
          style={{
            "--progress-background": getProgressColor()
          } as React.CSSProperties}
        />
      </div>

      {agent.lastBid !== null && showLastBid && (
        <div className="cyber-border rounded-md px-3 py-2 text-center w-full">
          <div className={`text-sm text-muted-foreground ${isMobile ? 'hidden' : 'block'}`}>Last bid</div>
          <div className="cyber-text text-lg flex items-center justify-center">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className={`${isBidWinner && !isGameOver && !activeBidding ? "text-teal-400" : "text-amber-500"}`}>
              {agent.lastBid}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgent;
