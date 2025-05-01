
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Info } from "lucide-react";

interface GameControlsProps {
  onShowRules: () => void;
}

const GameControls = ({ onShowRules }: GameControlsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-center">
      <Button 
        onClick={onShowRules} 
        variant="outline" 
        className="bg-slate-800 border-teal-500/30 hover:bg-teal-500/20 animate-fade-in"
      >
        <Info className="mr-1" size={18} />
        Game Rules
      </Button>
    </div>
  );
};

export default GameControls;
