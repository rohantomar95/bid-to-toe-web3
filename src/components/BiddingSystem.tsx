
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { AgentType } from "./AIAgent";
import { toast } from "sonner";

interface BiddingSystemProps {
  agents: AgentType[];
  onBidComplete: (agentId: string, winningBid: number) => void;
  disabled: boolean;
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

const BiddingSystem = ({ agents, onBidComplete, disabled }: BiddingSystemProps) => {
  const [isBidding, setIsBidding] = useState(false);
  const [bids, setBids] = useState<{[key: string]: number | null}>({});
  const [showResults, setShowResults] = useState(false);
  const [tiedBid, setTiedBid] = useState(false);

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
    }
  }, [disabled, agents]);

  const startBidding = () => {
    if (disabled) return;
    
    setIsBidding(true);
    
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
        
        setTimeout(() => {
          onBidComplete(winner.id, winningBid);
        }, 1500);
      }
    }, 1200); // Simulate thinking delay
  };

  return (
    <div className="cyber-panel p-6 w-full">
      <h3 className="cyber-text text-xl mb-6 text-center">Bidding Round</h3>
      
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
    </div>
  );
};

export default BiddingSystem;
