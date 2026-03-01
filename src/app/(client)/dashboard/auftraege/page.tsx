import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getJobsForClient } from "@/lib/queries/jobs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  PlusCircle,
  MapPin,
  Calendar,
  MessageSquare,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import type { Metadata } from "next";
import { getServerTranslations } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Meine Auftraege",
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  OPEN: "bg-green-100 text-green-700",
  AWARDED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-purple-100 text-purple-700",
  REVIEWED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
  EXPIRED: "bg-gray-100 text-gray-500",
};

export default async function ClientJobsPage() {
  const t = await getServerTranslations();
  const session = await auth();

  if (!session?.user) {
    redirect("/anmelden");
  }

  const clientProfile = await db.clientProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!clientProfile) {
    redirect("/anmelden");
  }

  const statusLabels: Record<string, string> = {
    DRAFT: t.jobs.statusDraft,
    OPEN: t.jobs.statusOpen,
    AWARDED: t.jobs.statusAwarded,
    IN_PROGRESS: t.jobs.statusInProgress,
    COMPLETED: t.jobs.statusCompleted,
    REVIEWED: t.jobs.statusReviewed,
    CANCELLED: t.jobs.statusCancelled,
    EXPIRED: t.jobs.statusExpired,
  };

  const jobs = await getJobsForClient(clientProfile.id);

  const activeStatuses = ["OPEN", "AWARDED", "IN_PROGRESS", "DRAFT"];
  const completedStatuses = ["COMPLETED", "REVIEWED"];

  const activeJobs = jobs.filter((j) => activeStatuses.includes(j.status));
  const completedJobs = jobs.filter((j) => completedStatuses.includes(j.status));

  function JobList({
    items,
  }: {
    items: typeof jobs;
  }) {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Briefcase className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t.jobs.noJobs}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {items.map((job) => (
          <Link
            key={job.id}
            href={`/dashboard/auftraege/${job.id}`}
            className="block"
          >
            <Card className="transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center justify-between gap-4">
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
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {job._count.bids}{" "}
                      {job._count.bids === 1 ? t.dashboard.bid : t.dashboard.bids}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDistanceToNow(new Date(job.createdAt), {
                        addSuffix: true,
                        locale: de,
                      })}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.myJobs}</h2>
          <p className="text-muted-foreground">
            {t.dashboard.overview}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/auftraege/neu">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t.dashboard.newJob}
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="aktiv">
        <TabsList>
          <TabsTrigger value="aktiv">
            {t.jobs.active} ({activeJobs.length})
          </TabsTrigger>
          <TabsTrigger value="abgeschlossen">
            {t.jobs.completed} ({completedJobs.length})
          </TabsTrigger>
          <TabsTrigger value="alle">
            {t.jobs.all} ({jobs.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="aktiv" className="mt-4">
          <JobList items={activeJobs} />
        </TabsContent>
        <TabsContent value="abgeschlossen" className="mt-4">
          <JobList items={completedJobs} />
        </TabsContent>
        <TabsContent value="alle" className="mt-4">
          <JobList items={jobs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
