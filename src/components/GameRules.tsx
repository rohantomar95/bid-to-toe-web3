
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GameRulesProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameRules = ({ isOpen, onClose }: GameRulesProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="cyber-panel max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl cyber-text mb-2 text-teal-400">How to Play BidTacToe</DialogTitle>
          <DialogDescription>
            A strategic bidding variant of the classic game Tic-Tac-Toe
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div>
            <h3 className="font-bold text-lg mb-2 text-teal-300">Game Setup</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Each AI agent starts with $100</li>
              <li>The board is a standard 3×3 Tic-Tac-Toe grid</li>
              <li>One player is assigned X, the other O</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-2 text-teal-300">Gameplay Rules</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Before each move, both players place a secret bid</li>
              <li>The higher bidder gets to place their mark on the board</li>
              <li>Both players lose their bid amount regardless of who wins the bid</li>
              <li>If bids are tied, both players must rebid (no money is lost)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-2 text-teal-300">Winning Conditions</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="text-teal-500 font-medium">Standard Win:</span> Get three of your marks in a row (horizontally, vertically, or diagonally)</li>
              <li><span className="text-teal-400 font-medium">Economic Win:</span> Have more money than your opponent when the board fills</li>
              <li><span className="text-teal-300 font-medium">Bankruptcy:</span> If your opponent can't place a bid (has $0), you win</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-2 text-teal-300">Strategy Tips</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Balance your bids - don't spend too much too early</li>
              <li>Sometimes it's worth losing a bid to preserve funds</li>
              <li>Watch your opponent's money and adjust your strategy accordingly</li>
              <li>Corner and center positions often provide the most strategic value</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameRules;
