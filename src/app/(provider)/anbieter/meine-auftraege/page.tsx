import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getProviderJobs } from "@/lib/queries/jobs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Euro,
  User,
  Briefcase,
  ArrowRight,
  Star,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import type { Metadata } from "next";
import { getServerTranslations } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Meine Auftraege",
};

const statusColors: Record<string, string> = {
  AWARDED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-purple-100 text-purple-700",
  REVIEWED: "bg-gray-100 text-gray-600",
};

export default async function ProviderMyJobsPage() {
  const t = await getServerTranslations();

  const statusLabels: Record<string, string> = {
    AWARDED: t.jobs.statusAwarded,
    IN_PROGRESS: t.jobs.statusInProgress,
    COMPLETED: t.jobs.statusCompleted,
    REVIEWED: t.jobs.statusReviewed,
  };

  const session = await auth();

  if (!session?.user) {
    redirect("/anmelden");
  }

  const providerProfile = await db.providerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!providerProfile) {
    redirect("/anmelden");
  }

  const jobs = await getProviderJobs(providerProfile.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t.provider.myJobs}</h2>
        <p className="text-muted-foreground">
          {t.jobs.awarded}
        </p>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Briefcase className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t.jobs.noJobs}
            </p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/anbieter/auftraege">{t.provider.browseAll}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/anbieter/auftraege/${job.id}`}
              className="block"
            >
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold">{job.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {job.category.name}
                        </Badge>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[job.status] ?? "bg-gray-100 text-gray-700"}`}
                        >
                          {statusLabels[job.status] ?? job.status}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {job.client.user.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.city}
                    </span>
                    {job.awardedBid && (
                      <span className="flex items-center gap-1">
                        <Euro className="h-3.5 w-3.5" />
                        {job.awardedBid.amount.toFixed(2)} {t.common.euro}
                      </span>
                    )}
                    {job.awardedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {t.jobs.awarded}:{" "}
                        {format(new Date(job.awardedAt), "dd.MM.yyyy", {
                          locale: de,
                        })}
                      </span>
                    )}
                  </div>
                  {job.reviews.length > 0 && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < job.reviews[0].rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      {job.reviews[0].title && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          {job.reviews[0].title}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
