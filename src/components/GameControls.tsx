
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GameControlsProps {
  onNewGame: () => void;
  onShowRules: () => void;
}

const GameControls = ({ onNewGame, onShowRules }: GameControlsProps) => {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleReset = () => {
    setResetDialogOpen(false);
    onNewGame();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button onClick={onShowRules} variant="outline" className="bg-cyber-gray border-cyber-purple/30 hover:bg-cyber-purple/20">
        Game Rules
      </Button>
      <Button onClick={() => setResetDialogOpen(true)} variant="outline" className="bg-cyber-gray border-cyber-purple/30 hover:bg-cyber-purple/20">
        New Game
      </Button>

      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="cyber-panel border-cyber-purple/40">
          <DialogHeader>
            <DialogTitle>Reset Game</DialogTitle>
            <DialogDescription>
              Are you sure you want to start a new game? All current game progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReset} className="bg-cyber-purple hover:bg-cyber-light-purple">
              New Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameControls;
