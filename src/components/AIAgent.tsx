
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { DollarSign } from "lucide-react";

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
  const statusColor = isActive ? "bg-cyber-purple" : "bg-muted";
  const bidWinnerStyle = isBidWinner === true 
    ? "cyber-border animate-pulse-glow" 
    : isBidWinner === false 
      ? "opacity-70" 
      : "";

  return (
    <div className={`cyber-panel flex flex-col items-center p-4 transition-all duration-300 ${bidWinnerStyle}`}>
      <div className="relative mb-3">
        <Avatar className="w-20 h-20 border-2 border-cyber-purple/50">
          <img 
            src={agent.avatar} 
            alt={agent.name}
            className="object-cover"
          />
        </Avatar>
        <div className={`absolute top-0 right-0 w-4 h-4 rounded-full ${statusColor} border border-white`}></div>
      </div>

      <h3 className="cyber-text text-xl font-bold text-center mb-1">{agent.name}</h3>
      <div className="text-sm text-muted-foreground mb-4">Agent {agent.mark}</div>

      <div className="w-full mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-muted-foreground">Balance</span>
          <span className="cyber-text flex items-center">
            <DollarSign className="w-4 h-4 mr-1 text-cyber-green" />
            <span className={`${agent.money <= 20 ? "text-cyber-red" : "text-cyber-green"}`}>
              {agent.money}
            </span>
          </span>
        </div>
        <Progress 
          value={agent.money} 
          max={100} 
          className="h-2 bg-muted"
          indicatorClassName={`${agent.money <= 20 ? "bg-cyber-red" : "bg-cyber-green"}`}
        />
      </div>

      {showLastBid && agent.lastBid !== null && (
        <div className="cyber-border rounded-md px-4 py-2 text-center w-full">
          <div className="text-sm text-muted-foreground">Last bid</div>
          <div className="cyber-text text-lg flex items-center justify-center">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className={`${isBidWinner ? "text-cyber-green" : "text-cyber-red"}`}>
              {agent.lastBid}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgent;
