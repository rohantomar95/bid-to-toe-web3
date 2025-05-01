
import { useState, useEffect } from "react";
import { X, Circle } from "lucide-react";
import { AgentType } from "./AIAgent";

interface GameBoardProps {
  currentPlayer: AgentType | null;
  onCellClick?: (index: number) => void;
  board: (string | null)[];
  winningCombination: number[] | null;
  disabled: boolean;
}

const GameBoard = ({ currentPlayer, onCellClick, board, winningCombination, disabled }: GameBoardProps) => {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  const handleCellClick = (index: number) => {
    if (disabled || board[index]) return;
    onCellClick?.(index);
  };

  const renderCell = (index: number) => {
    const isWinningCell = winningCombination?.includes(index);
    const content = board[index];
    const showPreview = hoveredCell === index && !board[index] && !disabled && currentPlayer;
    
    return (
      <div
        key={index}
        className={`game-cell aspect-square flex items-center justify-center transition-all duration-300
                   ${isWinningCell ? "bg-cyber-purple/30 cyber-glow" : "bg-cyber-gray/30"} 
                   ${disabled ? "cursor-not-allowed" : ""}
                   border border-cyber-purple/20`}
        onClick={() => handleCellClick(index)}
        onMouseEnter={() => setHoveredCell(index)}
        onMouseLeave={() => setHoveredCell(null)}
      >
        {content === "X" && (
          <X className={`w-12 h-12 text-cyber-purple ${isWinningCell ? "animate-pulse" : ""}`} />
        )}
        {content === "O" && (
          <Circle className={`w-12 h-12 text-cyber-blue ${isWinningCell ? "animate-pulse" : ""}`} />
        )}
        {showPreview && (
          <div className="opacity-30">
            {currentPlayer.mark === "X" ? (
              <X className="w-12 h-12 text-cyber-purple" />
            ) : (
              <Circle className="w-12 h-12 text-cyber-blue" />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="cyber-panel p-4 w-full max-w-md">
      <div className="grid grid-cols-3 gap-2">
        {Array(9).fill(null).map((_, index) => renderCell(index))}
      </div>
    </div>
  );
};

export default GameBoard;
