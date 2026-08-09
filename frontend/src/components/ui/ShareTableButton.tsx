import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from './Button';
import { useToast } from './Toast';

export function ShareTableButton({ tableNumber, storeId }: { tableNumber: string, storeId: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    // Generate the session URL based on the current domain
    const url = `${window.location.origin}/?table=${tableNumber}&storeId=${storeId}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join my POP O'BOB Table!",
          text: `I'm at table ${tableNumber}. Join my group order!`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast("Invite link copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing", err);
    }
  };

  return (
    <Button 
      variant="secondary" 
      size="sm" 
      onClick={handleShare}
      className="flex items-center gap-2 rounded-full px-4"
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      <span className="text-xs uppercase tracking-widest font-black">
        {copied ? "Copied" : "Invite Friends"}
      </span>
    </Button>
  );
}
