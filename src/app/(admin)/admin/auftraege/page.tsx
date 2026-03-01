import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import type { JobStatus } from "@prisma/client";
import { ExternalLink } from "lucide-react";
import { getServerTranslations } from "@/lib/i18n/server";

const statusBadgeColor: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  OPEN: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  AWARDED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  COMPLETED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  REVIEWED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  EXPIRED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  DISPUTED: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

const allStatuses: JobStatus[] = [
  "DRAFT",
  "OPEN",
  "AWARDED",
  "IN_PROGRESS",
  "COMPLETED",
  "REVIEWED",
  "CANCELLED",
  "EXPIRED",
  "DISPUTED",
];

export default async function AuftraegePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const t = await getServerTranslations();

  const statusLabel: Record<string, string> = {
    DRAFT: t.admin.statusDraft,
    OPEN: t.admin.statusOpen,
    AWARDED: t.admin.statusAwarded,
    IN_PROGRESS: t.admin.statusInProgress,
    COMPLETED: t.admin.statusCompleted,
    REVIEWED: t.admin.statusReviewed,
    CANCELLED: t.admin.statusCancelled,
    EXPIRED: t.admin.statusExpired,
    DISPUTED: t.admin.statusDisputed,
  };

  const { status } = await searchParams;
  const filterStatus = status && allStatuses.includes(status as JobStatus) ? (status as JobStatus) : undefined;

  const jobs = await db.job.findMany({
    where: filterStatus ? { status: filterStatus } : undefined,
    include: {
      client: {
        include: {
          user: { select: { name: true } },
        },
      },
      category: { select: { name: true } },
      _count: { select: { bids: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t.admin.jobs}</h2>
        <p className="text-muted-foreground">
          {t.admin.jobsSubtitle}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/auftraege">
          <Button variant={!filterStatus ? "default" : "outline"} size="sm">
            {t.common.all}
          </Button>
        </Link>
        {allStatuses.map((s) => (
          <Link key={s} href={`/admin/auftraege?status=${s}`}>
            <Button
              variant={filterStatus === s ? "default" : "outline"}
              size="sm"
            >
              {statusLabel[s]}
            </Button>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pt-4 font-medium text-muted-foreground">{t.admin.jobTitle}</th>
                  <th className="pb-3 pt-4 font-medium text-muted-foreground">{t.admin.clientName}</th>
                  <th className="pb-3 pt-4 font-medium text-muted-foreground">{t.admin.categoryCol}</th>
                  <th className="pb-3 pt-4 font-medium text-muted-foreground">{t.admin.status}</th>
                  <th className="pb-3 pt-4 font-medium text-muted-foreground">{t.admin.cityCol}</th>
                  <th className="pb-3 pt-4 font-medium text-muted-foreground">{t.admin.created}</th>
                  <th className="pb-3 pt-4 font-medium text-muted-foreground text-center">{t.admin.bidsCol}</th>
                  <th className="pb-3 pt-4 font-medium text-muted-foreground text-right">{t.admin.details}</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b last:border-0">
                    <td className="py-3 font-medium max-w-[200px] truncate">
                      {job.title}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {job.client.user.name}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {job.category.name}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant="secondary"
                        className={statusBadgeColor[job.status] || ""}
                      >
                        {statusLabel[job.status] || job.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{job.city}</td>
                    <td className="py-3 text-muted-foreground">
                      {format(job.createdAt, "dd.MM.yyyy", { locale: de })}
                    </td>
                    <td className="py-3 text-center">{job._count.bids}</td>
                    <td className="py-3 text-right">
                      <Link href={`/admin/auftraege/${job.id}`}>
                        <Button variant="ghost" size="icon-xs">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">{t.admin.details}</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      {t.admin.noJobsFound}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        {jobs.length} {t.admin.jobsTotal}{filterStatus ? ` ${t.admin.jobsWithStatus} "${statusLabel[filterStatus]}"` : ""}
      </p>
    </div>
  );
}
