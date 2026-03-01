import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { PLAN_LIMITS, PLAN_FEATURES } from "@/lib/constants";
import { Check, ArrowRight, Zap, AlertTriangle } from "lucide-react";
import { SubscriptionActions } from "./subscription-actions";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function SubscriptionPage() {
  const t = await getServerTranslations();
  const session = await auth();
  if (!session || session.user.role !== "PROVIDER") redirect("/anmelden");

  const provider = await db.providerProfile.findUnique({
    where: { userId: session.user.id },
    include: { subscription: true },
  });

  if (!provider?.subscription) redirect("/anbieter/dashboard");

  const sub = provider.subscription;
  const planInfo = PLAN_LIMITS[sub.tier];
  const usagePercent = sub.monthlyAwardsLimit > 0
    ? Math.min((sub.monthlyAwardsUsed / sub.monthlyAwardsLimit) * 100, 100)
    : 0;

  const isTrialing = sub.status === "TRIALING";
  const isActive = sub.status === "ACTIVE";
  const trialDaysLeft = sub.trialEndsAt
    ? Math.max(0, Math.ceil((sub.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.provider.subTitle}</h1>
        <p className="text-muted-foreground">{t.provider.subTitle}</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {planInfo.name}
                {isTrialing && (
                  <Badge variant="secondary">{t.provider.trialing}</Badge>
                )}
                {isActive && (
                  <Badge className="bg-green-100 text-green-800">{t.provider.active}</Badge>
                )}
                {sub.status === "PAST_DUE" && (
                  <Badge variant="destructive">{t.provider.pastDue}</Badge>
                )}
                {sub.status === "CANCELLED" && (
                  <Badge variant="secondary">{t.provider.cancelled}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                {planInfo.price} € {t.common.perMonth}
              </CardDescription>
            </div>
            {sub.tier === "PREMIUM" && (
              <Zap className="h-6 w-6 text-yellow-500" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isTrialing && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">
                  {t.provider.trialing}: {trialDaysLeft} {t.common.days}
                </span>
              </div>
              <p className="mt-1 text-sm text-yellow-700">
                {sub.trialEndsAt && (
                  <>{t.provider.trialEnds} {format(sub.trialEndsAt, "dd. MMMM yyyy", { locale: de })}</>
                )}
              </p>
            </div>
          )}

          {/* Usage */}
          <div>
            <div className="flex items-center justify-between text-sm">
              <span>{t.provider.awardsUsed}</span>
              <span className="font-medium">
                {sub.monthlyAwardsUsed} / {sub.monthlyAwardsLimit === 999999 ? "∞" : sub.monthlyAwardsLimit}
              </span>
            </div>
            {sub.monthlyAwardsLimit < 999999 && (
              <Progress value={usagePercent} className="mt-2" />
            )}
          </div>

          {sub.currentPeriodEnd && isActive && (
            <div className="text-sm text-muted-foreground">
              {t.provider.billingPeriod}: {format(sub.currentPeriodEnd, "dd. MMMM yyyy", { locale: de })}
            </div>
          )}

          {sub.cancelAtPeriodEnd && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {t.provider.cancelled} {sub.currentPeriodEnd && format(sub.currentPeriodEnd, "dd. MMMM yyyy", { locale: de })}.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Actions */}
      <SubscriptionActions
        currentTier={sub.tier}
        status={sub.status}
        isTrialing={isTrialing}
        hasStripeSubscription={!!sub.stripeSubscriptionId}
      />

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>{t.pricing.features}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {PLAN_FEATURES[sub.tier].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {sub.tier !== "PREMIUM" && (
        <Card>
          <CardHeader>
            <CardTitle>{t.provider.changePlan}</CardTitle>
            <CardDescription>{t.provider.changePlan}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {sub.tier === "BASIC" && (
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">{t.pricing.pro}</h3>
                  <p className="text-2xl font-bold">50 €<span className="text-sm font-normal text-muted-foreground">{t.common.perMonth}</span></p>
                  <p className="mt-1 text-sm text-muted-foreground">{t.pricing.awardsPerMonth}</p>
                </div>
              )}
              <div className="rounded-lg border border-primary p-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{t.pricing.premium}</h3>
                  <Zap className="h-4 w-4 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold">139 €<span className="text-sm font-normal text-muted-foreground">{t.common.perMonth}</span></p>
                <p className="mt-1 text-sm text-muted-foreground">{t.common.unlimited} + {t.pricing.whatsappAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
