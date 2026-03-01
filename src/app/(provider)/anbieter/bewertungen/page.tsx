import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function ProviderReviewsPage() {
  const t = await getServerTranslations();
  const session = await auth();
  if (!session || session.user.role !== "PROVIDER") redirect("/anmelden");

  const provider = await db.providerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      reviews: {
        where: { deletedAt: null },
        include: {
          job: { select: { title: true, category: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!provider) redirect("/anmelden");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.reviews.title}</h1>
          <p className="text-muted-foreground">
            {provider.totalReviews} {t.reviews.totalReviews} · {t.reviews.averageRating} {provider.averageRating.toFixed(1)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 ${
                star <= Math.round(provider.averageRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {provider.reviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {t.reviews.noReviews}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {provider.reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(review.createdAt, "dd. MMM yyyy", { locale: de })}
                  </span>
                </div>
                {review.title && <CardTitle className="text-base">{review.title}</CardTitle>}
              </CardHeader>
              <CardContent>
                {review.comment && (
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {t.admin.jobCol}: {review.job.title} · {review.job.category.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
