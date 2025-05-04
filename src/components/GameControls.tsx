
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Info, Coins } from "lucide-react";

interface GameControlsProps {
  onShowRules: () => void;
  onSimulateCoinToss?: () => void;
  showCoinTossButton?: boolean;
}

const GameControls = ({ 
  onShowRules, 
  onSimulateCoinToss,
  showCoinTossButton = false 
}: GameControlsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-center gap-3">
      <Button 
        onClick={onShowRules} 
        variant="outline" 
        className="bg-slate-800 border-teal-500/30 hover:bg-teal-500/20 animate-fade-in"
      >
        <Info className="mr-1" size={18} />
        Game Rules
      </Button>

      {showCoinTossButton && onSimulateCoinToss && (
        <Button
          onClick={onSimulateCoinToss}
          variant="outline"
          className="bg-slate-800 border-amber-500/30 hover:bg-amber-500/20 animate-fade-in"
        >
          <Coins className="mr-1 text-amber-400" size={18} />
          Simulate Coin Toss
        </Button>
      )}
    </div>
  );
};

export default GameControls;
