
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
      <Button onClick={onShowRules} variant="outline" className="bg-slate-800 border-teal-500/30 hover:bg-teal-500/20">
        Game Rules
      </Button>
      <Button onClick={() => setResetDialogOpen(true)} variant="outline" className="bg-slate-800 border-teal-500/30 hover:bg-teal-500/20">
        New Game
      </Button>

      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="cyber-panel border-teal-500/40">
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
            <Button onClick={handleReset} className="bg-teal-500 hover:bg-teal-400">
              New Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameControls;
