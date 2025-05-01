
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface GameControlsProps {
  onShowRules: () => void;
}

const GameControls = ({ onShowRules }: GameControlsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`flex ${isMobile ? 'flex-row' : 'flex-col sm:flex-row'} gap-3`}>
      <Button onClick={onShowRules} variant="outline" className="bg-slate-800 border-teal-500/30 hover:bg-teal-500/20">
        Game Rules
      </Button>
    </div>
  );
};

export default GameControls;
