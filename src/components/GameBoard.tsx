
import { useState } from "react";
import { X, Circle } from "lucide-react";
import { AgentType } from "./AIAgent";
import { useIsMobile } from "@/hooks/use-mobile";

interface GameBoardProps {
  currentPlayer: AgentType | null;
  board: (string | null)[];
  winningCombination: number[] | null;
  disabled: boolean;
  onCellClick?: (index: number) => void;
}

const GameBoard = ({ currentPlayer, board, winningCombination, disabled, onCellClick }: GameBoardProps) => {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const handleClick = (index: number) => {
    if (onCellClick && !disabled && !board[index]) {
      onCellClick(index);
    }
  };

  const renderCell = (index: number) => {
    const isWinningCell = winningCombination?.includes(index);
    const content = board[index];
    const showPreview = hoveredCell === index && !board[index] && !disabled && currentPlayer;
    
    return (
      <div
        key={index}
        className={`game-cell aspect-square flex items-center justify-center transition-all duration-300
                   ${isWinningCell ? "bg-teal-500/30 cyber-glow" : "bg-slate-800/40"} 
                   ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
                   border border-teal-500/20`}
        onMouseEnter={() => setHoveredCell(index)}
        onMouseLeave={() => setHoveredCell(null)}
        onClick={() => handleClick(index)}
      >
        {content === "X" && (
          <X className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} text-teal-500 ${isWinningCell ? "animate-pulse" : ""}`} />
        )}
        {content === "O" && (
          <Circle className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} text-teal-300 ${isWinningCell ? "animate-pulse" : ""}`} />
        )}
        {showPreview && (
          <div className="opacity-30">
            {currentPlayer.mark === "X" ? (
              <X className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} text-teal-500`} />
            ) : (
              <Circle className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} text-teal-300`} />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`cyber-panel p-4 w-full ${isMobile ? 'max-w-xs' : 'max-w-md'}`}>
      <div className="grid grid-cols-3 gap-2">
        {Array(9).fill(null).map((_, index) => renderCell(index))}
      </div>
    </div>
  );
};

export default GameBoard;
