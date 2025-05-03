import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, Sparkles } from "lucide-react";
import { AgentType } from "./AIAgent";
import { toast } from "sonner";

interface BiddingSystemProps {
  agents: AgentType[];
  onBidComplete: (agentId: string, winningBid: number) => void;
  disabled: boolean;
  autoStart?: boolean;
  onBiddingStateChange?: (isBidding: boolean) => void;
}

// Generate a random bid between min and max (inclusive)
const generateRandomBid = (agent: AgentType, min: number = 1) => {
  // Don't let AI bid more than they have
  const max = Math.min(agent.money, 25); // Maximum 25% of initial money
  const bid = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Logic to make bids more strategic
  if (agent.money <= 10) {
    // Desperate measures - bid almost everything
    return Math.max(1, Math.floor(agent.money * 0.8));
  } else if (agent.money <= 30) {
    // Conservative bidding when low on funds
    return Math.max(1, Math.floor(bid * 0.7));
  }
  
  return bid;
};

// Bidding system messages for more dynamic commentary
const BIDDING_MESSAGES = [
  "Agents calculating optimal bids...",
  "Quantum algorithms processing bid values...",
  "Neural networks evaluating board positions...",
  "Blockchain validators confirming bids...",
  "AI agents preparing their strategies...",
  "Bidding protocols initializing...",
];

const BiddingSystem = ({ 
  agents, 
  onBidComplete, 
  disabled, 
  autoStart = false,
  onBiddingStateChange
}: BiddingSystemProps) => {
  const [isBidding, setIsBidding] = useState(false);
  const [bids, setBids] = useState<{[key: string]: number | null}>({});
  const [showResults, setShowResults] = useState(false);
  const [tiedBid, setTiedBid] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Waiting for bids...");

  // Notify parent component when bidding state changes
  useEffect(() => {
    if (onBiddingStateChange) {
      onBiddingStateChange(isBidding);
    }
  }, [isBidding, onBiddingStateChange]);

  useEffect(() => {
    if (!disabled) {
      // Reset bids when a new round starts
      const initialBids = agents.reduce((acc, agent) => {
        acc[agent.id] = null;
        return acc;
      }, {} as {[key: string]: number | null});
      
      setBids(initialBids);
      setShowResults(false);
      setTiedBid(false);
      
      // Auto-start bidding if enabled
      if (autoStart && !isBidding) {
        const timer = setTimeout(() => {
          startBidding();
        }, 1000); // Slight delay before auto-starting
        return () => clearTimeout(timer);
      }
    }
  }, [disabled, agents, autoStart]);

  const startBidding = () => {
    if (disabled || isBidding) return;
    
    setIsBidding(true);
    
    // Show a random message for more interesting commentary
    setStatusMessage(BIDDING_MESSAGES[Math.floor(Math.random() * BIDDING_MESSAGES.length)]);
    
    // Generate bids for both agents
    const newBids = { ...bids };
    agents.forEach(agent => {
      newBids[agent.id] = generateRandomBid(agent);
    });
    
    // Simulate AI "thinking" time
    setTimeout(() => {
      setBids(newBids);
      setIsBidding(false);
      setShowResults(true);
      
      // Check for tied bids
      if (agents.length === 2 && newBids[agents[0].id] === newBids[agents[1].id]) {
        setTiedBid(true);
        setStatusMessage("Bids are tied! Rebidding required...");
        toast("Bids are tied! Both agents must rebid.", {
          description: "No money will be lost in this tie."
        });
      } else {
        // Find the winning bid
        const sortedAgents = [...agents].sort((a, b) => {
          const bidA = newBids[a.id] || 0;
          const bidB = newBids[b.id] || 0;
          return bidB - bidA; // Sort by highest bid first
        });
        
        const winner = sortedAgents[0];
        const winningBid = newBids[winner.id] || 0;
        
        setStatusMessage(`${winner.name} wins the bidding round!`);
        
        setTimeout(() => {
          onBidComplete(winner.id, winningBid);
        }, 1200);
      }
    }, 1500); // Simulate thinking delay
  };

  return (
    <div className="cyber-panel p-6 w-full">
      <h3 className="cyber-text text-xl mb-4 text-center flex items-center justify-center">
        <Sparkles className="w-5 h-5 mr-2 text-cyber-purple" />
        Bidding Round
      </h3>
      
      {showResults ? (
        <div className="text-center text-cyber-blue mb-4 animate-fade-in">
          {statusMessage}
        </div>
      ) : isBidding ? (
        <div className="text-center text-cyber-purple mb-4 animate-pulse">
          {statusMessage}
        </div>
      ) : null}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {agents.map(agent => (
          <div key={agent.id} className="flex flex-col items-center">
            <div className="text-muted-foreground mb-2">{agent.name}'s Bid</div>
            <div className="cyber-border h-16 w-full rounded-lg flex items-center justify-center relative overflow-hidden">
              {isBidding ? (
                <div className="animate-pulse flex items-center">
                  <DollarSign className="w-5 h-5 mr-1 opacity-70" />
                  <span className="text-xl">...</span>
                </div>
              ) : bids[agent.id] !== null ? (
                <div className="cyber-text flex items-center text-2xl">
                  <DollarSign className="w-5 h-5 mr-1" />
                  <span>{bids[agent.id]}</span>
                </div>
              ) : (
                <div className="text-muted-foreground">Waiting for bid</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!autoStart && (
        <div className="flex justify-center">
          <Button 
            onClick={startBidding} 
            disabled={isBidding || disabled || (tiedBid && !showResults)}
            className={`cyber-button ${isBidding ? 'animate-pulse' : ''}`}
          >
            {tiedBid && showResults 
              ? "Rebid (Tied)" 
              : showResults 
                ? "Next Round" 
                : "Start Bidding Round"}
          </Button>
        </div>
      )}
      
      {autoStart && tiedBid && showResults && (
        <div className="flex justify-center">
          <Button 
            onClick={startBidding} 
            disabled={isBidding}
            className="cyber-button animate-pulse"
          >
            Rebid (Tied)
          </Button>
        </div>
      )}
    </div>
  );
};

export default BiddingSystem;
