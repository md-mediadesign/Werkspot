import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function SubscriptionSuccessPage() {
  const t = await getServerTranslations();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">{t.provider.subSuccess}</CardTitle>
          <CardDescription>
            {t.provider.subSuccessDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/anbieter/auftraege">{t.provider.findJobsBtn}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/anbieter/abo">{t.provider.viewSubDetails}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
