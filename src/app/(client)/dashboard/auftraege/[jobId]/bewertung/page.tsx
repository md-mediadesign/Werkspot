"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { createReview } from "@/actions/reviews";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "@/components/locale-provider";

export default function ReviewPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams<{ jobId: string }>();
  const jobId = params.jobId;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (rating === 0) {
      toast.error(t.reviews.rating);
      return;
    }

    startTransition(async () => {
      try {
        const result = await createReview({
          jobId,
          rating,
          title: title || undefined,
          comment: comment || undefined,
        });

        if (result.error) {
          toast.error(result.error);
          return;
        }

        toast.success(t.reviews.submitSuccess);
        router.push(`/dashboard/auftraege/${jobId}`);
      } catch {
        toast.error(t.reviews.submitError);
      }
    });
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/auftraege/${jobId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.common.back}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.reviews.writeReview}</CardTitle>
          <CardDescription>
            {t.reviews.commentPlaceholder}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label>{t.reviews.rating} *</Label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;
                  const isFilled =
                    starValue <= (hoverRating || rating);

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="rounded p-1 transition-colors hover:bg-muted"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          isFilled
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  );
                })}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {rating} {t.reviews.ratingOf5}
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">{t.reviews.titleLabel} ({t.common.optional})</Label>
              <Input
                id="title"
                placeholder={t.reviews.titlePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">{t.reviews.comment} ({t.common.optional})</Label>
              <Textarea
                id="comment"
                placeholder={t.reviews.commentPlaceholder}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {comment.length}/1000
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || rating === 0}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.reviews.submitting}
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  {t.reviews.submit}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
