import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  Euro,
  Calendar,
  FileText,
  ArrowRight,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { WithdrawBidButton } from "./withdraw-bid-button";
import type { Metadata } from "next";
import { getServerTranslations } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Meine Angebote",
};

const bidStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  AWARDED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  WITHDRAWN: "bg-gray-100 text-gray-500",
};

export default async function ProviderBidsPage() {
  const t = await getServerTranslations();

  const bidStatusLabels: Record<string, string> = {
    PENDING: t.bids.pending,
    AWARDED: t.bids.awarded,
    REJECTED: t.bids.rejected,
    WITHDRAWN: t.bids.withdrawn,
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

  const bids = await db.bid.findMany({
    where: { providerId: providerProfile.id },
    include: {
      job: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const pendingBids = bids.filter((b) => b.status === "PENDING");
  const awardedBids = bids.filter((b) => b.status === "AWARDED");
  const rejectedBids = bids.filter(
    (b) => b.status === "REJECTED" || b.status === "WITHDRAWN"
  );

  function BidList({
    items,
    showWithdraw = false,
  }: {
    items: typeof bids;
    showWithdraw?: boolean;
  }) {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t.bids.noBids}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {items.map((bid) => (
          <Card key={bid.id} className="transition-colors hover:bg-muted/50">
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/anbieter/auftraege/${bid.jobId}`}
                    className="group"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold group-hover:underline">
                        {bid.job.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {bid.job.category.name}
                      </Badge>
                    </div>
                  </Link>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <Euro className="h-3.5 w-3.5" />
                      {bid.amount.toFixed(2)} {t.common.euro}
                    </span>
                    {bid.estimatedDays && (
                      <span>ca. {bid.estimatedDays} {t.common.days}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDistanceToNow(new Date(bid.createdAt), {
                        addSuffix: true,
                        locale: de,
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${bidStatusColors[bid.status] ?? "bg-gray-100 text-gray-700"}`}
                  >
                    {bidStatusLabels[bid.status] ?? bid.status}
                  </span>
                  {showWithdraw && bid.status === "PENDING" && (
                    <WithdrawBidButton bidId={bid.id} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t.bids.title}</h2>
        <p className="text-muted-foreground">
          {t.bids.title}
        </p>
      </div>

      <Tabs defaultValue="offen">
        <TabsList>
          <TabsTrigger value="offen">
            {t.bids.pending} ({pendingBids.length})
          </TabsTrigger>
          <TabsTrigger value="zuschlag">
            {t.bids.awarded} ({awardedBids.length})
          </TabsTrigger>
          <TabsTrigger value="abgelehnt">
            {t.bids.rejected} ({rejectedBids.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="offen" className="mt-4">
          <BidList items={pendingBids} showWithdraw />
        </TabsContent>
        <TabsContent value="zuschlag" className="mt-4">
          <BidList items={awardedBids} />
        </TabsContent>
        <TabsContent value="abgelehnt" className="mt-4">
          <BidList items={rejectedBids} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
