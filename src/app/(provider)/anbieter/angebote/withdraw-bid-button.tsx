"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { withdrawBid } from "@/actions/bids";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

export function WithdrawBidButton({ bidId }: { bidId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleWithdraw() {
    if (!confirm("Moechten Sie dieses Angebot wirklich zurueckziehen?")) return;

    startTransition(async () => {
      const result = await withdrawBid(bidId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Angebot zurueckgezogen.");
        router.refresh();
      }
    });
  }

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={handleWithdraw}
      disabled={isPending}
      className="text-destructive hover:text-destructive"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <X className="h-3.5 w-3.5" />
      )}
      <span className="ml-1">Zurueckziehen</span>
    </Button>
  );
}
