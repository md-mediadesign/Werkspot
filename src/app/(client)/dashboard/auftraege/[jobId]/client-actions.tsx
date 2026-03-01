"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { awardBid, markJobCompleted } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle, Loader2 } from "lucide-react";
import { useTranslations } from "@/components/locale-provider";

export function AwardBidButton({
  jobId,
  bidId,
}: {
  jobId: string;
  bidId: string;
}) {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAward() {
    if (!confirm(t.jobs.awardConfirm)) return;

    startTransition(async () => {
      const result = await awardBid(jobId, bidId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t.jobs.awardBid);
        router.refresh();
      }
    });
  }

  return (
    <Button size="sm" onClick={handleAward} disabled={isPending}>
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Award className="mr-2 h-4 w-4" />
      )}
      {t.jobs.awardBid}
    </Button>
  );
}

export function MarkCompletedButton({ jobId }: { jobId: string }) {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleComplete() {
    if (!confirm(t.jobs.markCompletedConfirm))
      return;

    startTransition(async () => {
      const result = await markJobCompleted(jobId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t.jobs.statusCompleted);
        router.refresh();
      }
    });
  }

  return (
    <Button onClick={handleComplete} disabled={isPending}>
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle className="mr-2 h-4 w-4" />
      )}
      {t.jobs.markCompleted}
    </Button>
  );
}
