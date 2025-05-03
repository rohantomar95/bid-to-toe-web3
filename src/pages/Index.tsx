
import { useState, useEffect, useRef } from "react";
import AIAgent, { AgentType } from "@/components/AIAgent";
import GameBoard from "@/components/GameBoard";
import GameControls from "@/components/GameControls";
import GameStatus from "@/components/GameStatus";
import GameRules from "@/components/GameRules";
import { toast } from "sonner";
import { MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

// Winning combinations on the board
const WINNING_COMBINATIONS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal \
  [2, 4, 6], // diagonal /
];

// Initial agents
const initialAgents: AgentType[] = [
  {
    id: "agent-x",
    name: "QuantumBot",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Zoey&backgroundColor=1EAEDB",
    money: 100,
    mark: "X",
    lastBid: null
  },
  {
    id: "agent-o",
    name: "NexusAI",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Midnight&backgroundColor=9b87f5",
    money: 100,
    mark: "O",
    lastBid: null
  }
];

// Bot thinking messages for random selection
const BOT_THINKING_MESSAGES = [
  "Analyzing board state...",
  "Computing optimal move...",
  "Evaluating strategic positions...",
  "Processing neural networks...",
  "Running decision algorithms...",
  "Calculating win probability...",
];

// Game event messages for the log
interface GameLogEntry {
  id: number;
  message: string;
  timestamp: Date;
  type: "info" | "bid" | "move" | "system";
}

// Timing constants (in milliseconds)
const THINKING_TIME_MIN = 1500;
const THINKING_TIME_MAX = 2500;
const BIDDING_DELAY = 2000;
const MESSAGE_DISPLAY_DELAY = 1500;

const Index = () => {
  // Game state
  const [agents, setAgents] = useState<AgentType[]>([...initialAgents]);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [gameStatus, setGameStatus] = useState<"bidding" | "playing" | "gameOver">("bidding");
  const [currentPlayer, setCurrentPlayer] = useState<AgentType | null>(null);
  const [winner, setWinner] = useState<AgentType | null>(null);
  const [winReason, setWinReason] = useState<"pattern" | "money" | "bankrupt" | null>(null);
  const [winningCombination, setWinningCombination] = useState<number[] | null>(null);
  const [turn, setTurn] = useState(1);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [lastBidWinner, setLastBidWinner] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [messageKey, setMessageKey] = useState<number>(0); // Add a key to trigger animations
  const [gameLogs, setGameLogs] = useState<GameLogEntry[]>([
    { 
      id: 0, 
      message: "Welcome to BidTacToe! AI agents are ready to battle.", 
      timestamp: new Date(), 
      type: "system" 
    }
  ]);
  
  const logIdRef = useRef(1);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoBidTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Add a log entry and update message with animation
  const addLog = (message: string, type: GameLogEntry['type'] = "info") => {
    const newLog: GameLogEntry = {
      id: logIdRef.current++,
      message,
      timestamp: new Date(),
      type
    };
    setGameLogs(prev => [...prev, newLog]);
    
    // Update status message with animation
    setStatusMessage(message);
    setMessageKey(prev => prev + 1);
  };
  
  // Auto start first bidding
  useEffect(() => {
    // Give users a moment to see the initial state
    const timer = setTimeout(() => {
      if (gameStatus === "bidding" && turn === 1) {
        setStatusMessage("Agents are analyzing the empty board...");
        setMessageKey(prev => prev + 1);
        addLog("Game started. Waiting for initial bids.", "system");
        startAutoBidding();
      }
    }, MESSAGE_DISPLAY_DELAY);
    return () => clearTimeout(timer);
  }, []);
  
  // Check for a winner
  useEffect(() => {
    checkGameOver();
  }, [board, agents]);

  // Auto place marker for AI during playing phase
  useEffect(() => {
    if (gameStatus === "playing" && currentPlayer) {
      // Random thinking time between min and max values
      const randomThinkingTime = Math.random() * (THINKING_TIME_MAX - THINKING_TIME_MIN) + THINKING_TIME_MIN;
      const randomThinkingMessage = BOT_THINKING_MESSAGES[Math.floor(Math.random() * BOT_THINKING_MESSAGES.length)];
      
      // Show thinking message with animation
      setStatusMessage(randomThinkingMessage);
      setMessageKey(prev => prev + 1);
      
      // Clear any existing timeout to avoid race conditions
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      
      autoPlayTimeoutRef.current = setTimeout(() => {
        placeAIMarker();
      }, randomThinkingTime);
    }
    
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [gameStatus, currentPlayer]);

  // Auto start bidding when in bidding phase
  useEffect(() => {
    if (gameStatus === "bidding" && !winner) {
      // Auto start bidding after a short delay
      startAutoBidding();
    }
  }, [gameStatus]);

  const startAutoBidding = () => {
    // Clear any existing timeout
    if (autoBidTimeoutRef.current) {
      clearTimeout(autoBidTimeoutRef.current);
    }
    
    // Add a bit of delay to make it seem like AI is thinking
    autoBidTimeoutRef.current = setTimeout(() => {
      if (gameStatus === "bidding") {
        // Generate bids for both agents
        const bids: { [key: string]: number } = {};
        
        agents.forEach(agent => {
          // Generate a random bid between 1 and 25% of their money
          const maxBid = Math.min(agent.money, Math.floor(agent.money * 0.25));
          const minBid = Math.max(1, Math.floor(agent.money * 0.05));
          bids[agent.id] = Math.floor(Math.random() * (maxBid - minBid + 1)) + minBid;
        });
        
        // Determine winner
        let winner: AgentType | null = null;
        let highestBid = 0;
        
        agents.forEach(agent => {
          if (bids[agent.id] > highestBid) {
            highestBid = bids[agent.id];
            winner = agent;
          }
        });
        
        // Handle tied bids
        const tiedAgents = agents.filter(agent => bids[agent.id] === highestBid);
        if (tiedAgents.length > 1) {
          // In case of a tie, choose a random winner
          winner = tiedAgents[Math.floor(Math.random() * tiedAgents.length)];
          addLog("Tie breaker! Random selection to determine turn order.", "system");
        }
        
        if (winner) {
          // Update all agents with their bids
          const updatedAgents = agents.map(agent => ({
            ...agent,
            money: agent.money - bids[agent.id],
            lastBid: bids[agent.id]
          }));
          
          setAgents(updatedAgents);
          setCurrentPlayer(winner);
          setLastBidWinner(winner.id);
          setGameStatus("playing");
          
          const otherAgent = agents.find(agent => agent.id !== winner!.id);
          const bidMessage = `${winner.name} won the bid with $${bids[winner.id]} vs $${otherAgent ? bids[otherAgent.id] : 0}`;
          addLog(bidMessage, "bid");
        }
      }
    }, BIDDING_DELAY);
  };

  const checkGameOver = () => {
    // Check for a line of three
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        const winnerAgent = agents.find(agent => agent.mark === board[a]) || null;
        setWinner(winnerAgent);
        setWinningCombination(combination);
        setWinReason("pattern");
        setGameStatus("gameOver");
        
        if (winnerAgent) {
          const winMessage = `${winnerAgent.name} wins with a line of three!`;
          addLog(winMessage, "system");
          // Keep toast only for game over
          toast(`${winnerAgent.name} wins the game!`, {
            description: "Game over",
          });
        }
        return;
      }
    }

    // Check for a full board
    if (!board.includes(null)) {
      // Find the agent with more money
      const sortedAgents = [...agents].sort((a, b) => b.money - a.money);
      
      if (sortedAgents[0].money > sortedAgents[1].money) {
        setWinner(sortedAgents[0]);
        setWinReason("money");
        setGameStatus("gameOver");
        const winMessage = `${sortedAgents[0].name} wins with more money! ($${sortedAgents[0].money})`;
        addLog(winMessage, "system");
        // Keep toast only for game over
        toast(`${sortedAgents[0].name} wins the game!`, {
          description: "With more remaining funds",
        });
      } else if (sortedAgents[0].money === sortedAgents[1].money) {
        // It's a tie
        setGameStatus("gameOver");
        const tieMessage = "It's a tie! Both agents have the same amount of money.";
        addLog(tieMessage, "system");
        // Keep toast only for game over
        toast("It's a tie!", {
          description: "Game over",
        });
      }
      return;
    }

    // Check if any agent has $0
    const bankruptAgents = agents.filter(agent => agent.money <= 0);
    if (bankruptAgents.length > 0) {
      // Find the non-bankrupt agent
      const winnerAgent = agents.find(agent => agent.money > 0) || null;
      if (winnerAgent) {
        setWinner(winnerAgent);
        setWinReason("bankrupt");
        setGameStatus("gameOver");
        const winMessage = `${winnerAgent.name} wins by bankrupting opponent!`;
        addLog(winMessage, "system");
        // Keep toast only for game over
        toast(`${winnerAgent.name} wins the game!`, {
          description: "Opponent bankrupted",
        });
      }
      return;
    }
  };

  // AI randomly selects an empty cell
  const placeAIMarker = () => {
    if (!currentPlayer) return;
    
    // Get all empty cells
    const emptyCells = board.map((cell, index) => (cell === null ? index : -1)).filter(index => index !== -1);
    
    if (emptyCells.length === 0) return;
    
    // AI selects a random cell (in a real app, this would be more strategic)
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const selectedCell = emptyCells[randomIndex];
    
    // Place marker on board
    const newBoard = [...board];
    newBoard[selectedCell] = currentPlayer.mark;
    setBoard(newBoard);
    
    const moveMessage = `${currentPlayer.name} placed ${currentPlayer.mark} at position ${selectedCell + 1}`;
    addLog(moveMessage, "move");
    
    // Move to next bidding phase with a slight delay
    setTimeout(() => {
      setGameStatus("bidding");
      setTurn(turn + 1);
      const nextBidMessage = "Next bidding round starting...";
      addLog(nextBidMessage, "system");
    }, MESSAGE_DISPLAY_DELAY);
  };

  const handleNewGame = () => {
    // Reset the game
    setAgents([...initialAgents]);
    setBoard(Array(9).fill(null));
    setGameStatus("bidding");
    setCurrentPlayer(null);
    setWinner(null);
    setWinReason(null);
    setWinningCombination(null);
    setTurn(1);
    setLastBidWinner(null);
    const newGameMessage = "New game starting! Agents are ready to bid.";
    setStatusMessage(newGameMessage);
    setMessageKey(prev => prev + 1);
    
    // Clear logs but keep the welcome message
    setGameLogs([{ 
      id: 0, 
      message: "Welcome to BidTacToe! AI agents are ready to battle.", 
      timestamp: new Date(), 
      type: "system" 
    }]);
    logIdRef.current = 1;
    
    toast("New game started!", {
      description: "Both agents start with $100",
    });
    
    addLog("New game started!", "system");
  };

  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full py-10 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 cyber-text tracking-wide">
            <span className="text-teal-500">Bid</span>
            <span className="text-white">Tac</span>
            <span className="text-teal-300">Toe</span>
          </h1>
          <p className="text-muted-foreground text-lg">Web3 AI Agent Battle Arena</p>
          
          {/* Rules Button moved up in the layout */}
          <div className="mt-4">
            <GameControls onShowRules={() => setRulesOpen(true)} />
          </div>
        </header>

        <GameStatus 
          status={gameStatus} 
          winner={winner}
          winReason={winReason}
          turn={turn}
          currentPlayer={currentPlayer}
          message={statusMessage}
          messageKey={messageKey}
        />
        
        {/* Restart Game Button - shown prominently when game is over */}
        {gameStatus === "gameOver" && (
          <div className="flex justify-center mb-6 animate-fade-in">
            <Button 
              onClick={handleNewGame} 
              className="restart-button gap-2 text-base py-2.5 px-8"
            >
              <RefreshCw className="h-5 w-5" />
              New Battle
            </Button>
          </div>
        )}

        {isMobile ? (
          /* Mobile Layout */
          <div className="flex flex-col gap-6">
            {/* Game Board at the top */}
            <div className="flex justify-center">
              <GameBoard 
                currentPlayer={currentPlayer}
                board={board}
                winningCombination={winningCombination}
                disabled={gameStatus !== "playing"}
              />
            </div>
            
            {/* Agents side by side */}
            <div className="grid grid-cols-2 gap-3">
              <AIAgent 
                agent={agents[0]} 
                isActive={currentPlayer?.id === agents[0].id}
                isBidWinner={lastBidWinner === agents[0].id}
                showLastBid={true}
                isGameOver={gameStatus === "gameOver"}
                isWinner={winner?.id === agents[0].id}
              />
              <AIAgent 
                agent={agents[1]} 
                isActive={currentPlayer?.id === agents[1].id}
                isBidWinner={lastBidWinner === agents[1].id}
                showLastBid={true}
                isGameOver={gameStatus === "gameOver"}
                isWinner={winner?.id === agents[1].id}
              />
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <AIAgent 
                agent={agents[0]} 
                isActive={currentPlayer?.id === agents[0].id}
                isBidWinner={lastBidWinner === agents[0].id}
                showLastBid={true}
                isGameOver={gameStatus === "gameOver"}
                isWinner={winner?.id === agents[0].id}
              />
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center gap-6">
              <GameBoard 
                currentPlayer={currentPlayer}
                board={board}
                winningCombination={winningCombination}
                disabled={gameStatus !== "playing"}
              />
            </div>

            <div className="lg:col-span-3 order-3">
              <AIAgent 
                agent={agents[1]} 
                isActive={currentPlayer?.id === agents[1].id}
                isBidWinner={lastBidWinner === agents[1].id}
                showLastBid={true}
                isGameOver={gameStatus === "gameOver"}
                isWinner={winner?.id === agents[1].id}
              />
            </div>
          </div>
        )}
        
        {/* Game Log Section */}
        <div className="mt-12 cyber-panel p-4">
          <div className="flex items-center mb-3">
            <MessageSquare className="w-5 h-5 mr-2 text-teal-500" />
            <h3 className="text-lg cyber-text">Battle Log</h3>
          </div>
          <ScrollArea className="h-40">
            <div className="space-y-2">
              {gameLogs.map((log) => (
                <div 
                  key={log.id} 
                  className={`text-sm px-3 py-2 rounded-md ${
                    log.type === "system" ? "bg-teal-500/20 text-teal-300" :
                    log.type === "bid" ? "bg-teal-700/20 text-teal-400" :
                    log.type === "move" ? "bg-teal-900/20 text-teal-200" :
                    "bg-slate-800/30 text-slate-300"
                  }`}
                >
                  <span className="text-slate-400 mr-2 text-xs">
                    [{log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}]
                  </span>
                  {log.message}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <GameRules 
          isOpen={rulesOpen}
          onClose={() => setRulesOpen(false)}
        />
      </div>
    </div>
  );
};

export default Index;
