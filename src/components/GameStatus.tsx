
import { AgentType } from "./AIAgent";

interface GameStatusProps {
  status: "bidding" | "playing" | "gameOver";
  winner: AgentType | null;
  winReason: "pattern" | "money" | "bankrupt" | null;
  turn: number;
  currentPlayer: AgentType | null;
}

const GameStatus = ({ status, winner, winReason, turn, currentPlayer }: GameStatusProps) => {
  let statusText = "";
  let statusClass = "text-xl cyber-text";
  
  if (status === "bidding") {
    statusText = "Bidding Phase";
    statusClass += " text-cyber-purple";
  } else if (status === "playing") {
    statusText = `Turn ${turn} - ${currentPlayer?.name}'s Move`;
    statusClass += " text-cyber-blue";
  } else if (status === "gameOver" && winner) {
    statusText = `${winner.name} Wins!`;
    statusClass += " text-cyber-green font-bold text-2xl";
  }
  
  return (
    <div className="text-center mb-4">
      <h2 className={statusClass}>{statusText}</h2>
      
      {status === "gameOver" && winner && winReason && (
        <div className="mt-2 text-muted-foreground">
          {winReason === "pattern" && "Victory by completing a line!"}
          {winReason === "money" && "Victory with more remaining funds!"}
          {winReason === "bankrupt" && "Victory by bankrupting opponent!"}
        </div>
      )}
    </div>
  );
};

export default GameStatus;
