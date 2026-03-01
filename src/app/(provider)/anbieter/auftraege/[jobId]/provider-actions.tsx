"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createBidSchema, type CreateBidInput } from "@/lib/validations/job";
import { placeBid } from "@/actions/bids";
import { markJobInProgress, markJobCompleted } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send, Play, CheckCircle } from "lucide-react";

export function PlaceBidForm({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBidInput>({
    resolver: zodResolver(createBidSchema),
    defaultValues: {
      jobId,
      amount: undefined,
      message: "",
      estimatedDays: undefined,
    },
  });

  function onSubmit(data: CreateBidInput) {
    startTransition(async () => {
      try {
        const result = await placeBid(data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Angebot erfolgreich abgegeben!");
          router.refresh();
        }
      } catch {
        toast.error("Ein unerwarteter Fehler ist aufgetreten.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("jobId")} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Betrag (EUR) *</Label>
          <Input
            id="amount"
            type="number"
            min={1}
            step="0.01"
            placeholder="z.B. 1500"
            {...register("amount", { valueAsNumber: true })}
          />
          {errors.amount && (
            <p className="text-sm text-destructive">
              {errors.amount.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatedDays">Geschaetzte Tage</Label>
          <Input
            id="estimatedDays"
            type="number"
            min={1}
            placeholder="z.B. 5"
            {...register("estimatedDays", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Nachricht *</Label>
        <Textarea
          id="message"
          placeholder="Beschreiben Sie, warum Sie der richtige Anbieter fuer diesen Auftrag sind..."
          rows={4}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-destructive">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wird gesendet...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Angebot abgeben
          </>
        )}
      </Button>
    </form>
  );
}

export function ProviderJobActions({
  jobId,
  jobStatus,
}: {
  jobId: string;
  jobStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleMarkInProgress() {
    startTransition(async () => {
      const result = await markJobInProgress(jobId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Auftrag als \"In Bearbeitung\" markiert!");
        router.refresh();
      }
    });
  }

  function handleMarkCompleted() {
    if (!confirm("Moechten Sie diesen Auftrag als abgeschlossen markieren?"))
      return;

    startTransition(async () => {
      const result = await markJobCompleted(jobId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Auftrag als abgeschlossen markiert!");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {jobStatus === "AWARDED" && (
        <Button onClick={handleMarkInProgress} disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          Bearbeitung starten
        </Button>
      )}
      {(jobStatus === "AWARDED" || jobStatus === "IN_PROGRESS") && (
        <Button
          variant={jobStatus === "IN_PROGRESS" ? "default" : "outline"}
          onClick={handleMarkCompleted}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="mr-2 h-4 w-4" />
          )}
          Als abgeschlossen markieren
        </Button>
      )}
    </div>
  );
}
