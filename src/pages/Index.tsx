
import { useState, useEffect } from "react";
import AIAgent, { AgentType } from "@/components/AIAgent";
import GameBoard from "@/components/GameBoard";
import BiddingSystem from "@/components/BiddingSystem";
import GameControls from "@/components/GameControls";
import GameStatus from "@/components/GameStatus";
import GameRules from "@/components/GameRules";
import { toast } from "sonner";

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
  
  // Check for a winner
  useEffect(() => {
    checkGameOver();
  }, [board, agents]);

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
          toast(`${winnerAgent.name} wins with a line of three!`, {
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
        toast(`${sortedAgents[0].name} wins with more money!`, {
          description: `Remaining: $${sortedAgents[0].money}`,
        });
      } else if (sortedAgents[0].money === sortedAgents[1].money) {
        // It's a tie
        setGameStatus("gameOver");
        toast("It's a tie! Both agents have the same amount of money.", {
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
        toast(`${winnerAgent.name} wins by bankrupting opponent!`, {
          description: "Game over",
        });
      }
      return;
    }
  };

  const handleBidComplete = (winningAgentId: string, bidAmount: number) => {
    setLastBidWinner(winningAgentId);
    
    // Update agent funds and last bid
    const updatedAgents = agents.map(agent => {
      const isWinner = agent.id === winningAgentId;
      const bid = isWinner ? bidAmount : agent.lastBid || 0;
      
      return {
        ...agent,
        money: Math.max(0, agent.money - bid),
        lastBid: bid
      };
    });
    
    const winningAgent = updatedAgents.find(agent => agent.id === winningAgentId) || null;
    
    // Update game state
    setAgents(updatedAgents);
    setCurrentPlayer(winningAgent);
    setGameStatus("playing");

    toast(`${winningAgent?.name} won the bid!`, {
      description: `Bid amount: $${bidAmount}`,
    });
  };

  const handleCellClick = (index: number) => {
    if (gameStatus !== "playing" || board[index] || !currentPlayer) return;

    // Place mark on board
    const newBoard = [...board];
    newBoard[index] = currentPlayer.mark;
    setBoard(newBoard);
    
    // Move to next bidding phase
    setGameStatus("bidding");
    setTurn(turn + 1);
    setLastBidWinner(null);
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
    
    toast("New game started!", {
      description: "Both agents start with $100",
    });
  };

  return (
    <div className="min-h-screen w-full py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 cyber-text tracking-wide">
            <span className="text-cyber-purple">Bid</span>
            <span className="text-white">Tac</span>
            <span className="text-cyber-blue">Toe</span>
          </h1>
          <p className="text-muted-foreground text-lg">Web3 AI Agent Battle Arena</p>
        </header>

        <GameStatus 
          status={gameStatus} 
          winner={winner}
          winReason={winReason}
          turn={turn}
          currentPlayer={currentPlayer}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <AIAgent 
              agent={agents[0]} 
              isActive={currentPlayer?.id === agents[0].id}
              isBidWinner={lastBidWinner === agents[0].id}
              showLastBid={gameStatus !== "bidding" || lastBidWinner !== null}
            />
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center gap-6">
            <GameBoard 
              currentPlayer={currentPlayer}
              onCellClick={handleCellClick}
              board={board}
              winningCombination={winningCombination}
              disabled={gameStatus !== "playing"}
            />

            {gameStatus === "bidding" && (
              <BiddingSystem 
                agents={agents}
                onBidComplete={handleBidComplete}
                disabled={gameStatus === "gameOver"}
              />
            )}

            <div className="mt-4">
              <GameControls 
                onNewGame={handleNewGame}
                onShowRules={() => setRulesOpen(true)}
              />
            </div>
          </div>

          <div className="lg:col-span-3 order-3">
            <AIAgent 
              agent={agents[1]} 
              isActive={currentPlayer?.id === agents[1].id}
              isBidWinner={lastBidWinner === agents[1].id}
              showLastBid={gameStatus !== "bidding" || lastBidWinner !== null}
            />
          </div>
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
