
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { DollarSign } from "lucide-react";
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
}

const AIAgent = ({ agent, isActive, isBidWinner, showLastBid }: AIAgentProps) => {
  const isMobile = useIsMobile();
  const statusColor = isActive ? "bg-teal-500" : "bg-muted";
  const bidWinnerStyle = isBidWinner === true 
    ? "cyber-border animate-pulse-glow" 
    : isBidWinner === false 
      ? "opacity-70" 
      : "";

  const getProgressColor = () => {
    if (agent.money <= 20) return "bg-amber-500";
    return "bg-teal-500";
  };

  return (
    <div className={`cyber-panel flex flex-col items-center p-4 transition-all duration-300 ${bidWinnerStyle}`}>
      <div className="relative mb-2">
        <Avatar className={`${isMobile ? 'w-14 h-14' : 'w-20 h-20'} border-2 border-teal-500/50`}>
          <img 
            src={agent.avatar} 
            alt={agent.name}
            className="object-cover"
          />
        </Avatar>
        <div className={`absolute top-0 right-0 w-4 h-4 rounded-full ${statusColor} border border-white`}></div>
      </div>

      <h3 className={`cyber-text ${isMobile ? 'text-lg' : 'text-xl'} font-bold text-center mb-1`}>{agent.name}</h3>
      <div className="text-sm text-muted-foreground mb-2">Agent {agent.mark}</div>

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

      {agent.lastBid !== null && (
        <div className="cyber-border rounded-md px-3 py-2 text-center w-full">
          <div className={`text-sm text-muted-foreground ${isMobile ? 'hidden' : 'block'}`}>Last bid</div>
          <div className="cyber-text text-lg flex items-center justify-center">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className={`${isBidWinner ? "text-teal-400" : "text-amber-500"}`}>
              {agent.lastBid}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgent;
