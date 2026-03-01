import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function RegistrierenPage() {
  const t = await getServerTranslations();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t.auth.chooseRole}</h1>
        <p className="mt-2 text-muted-foreground">
          {t.auth.chooseRoleDesc}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Client registration card */}
        <Card className="relative overflow-hidden transition-all hover:border-primary/30 hover:shadow-md">
          <CardHeader>
            <div className="mb-2">
              <Badge variant="secondary">{t.auth.clientBadge}</Badge>
            </div>
            <CardTitle className="text-xl">{t.auth.registerAsClient}</CardTitle>
            <CardDescription>
              {t.auth.registerClientDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">&#10003;</span>
                {t.auth.clientFeature1}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">&#10003;</span>
                {t.auth.clientFeature2}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">&#10003;</span>
                {t.auth.clientFeature3}
              </li>
            </ul>
            <Button className="w-full" asChild>
              <Link href="/registrieren/kunde">
                {t.common.next}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Provider registration card */}
        <Card className="relative overflow-hidden transition-all hover:border-primary/30 hover:shadow-md">
          <CardHeader>
            <div className="mb-2">
              <Badge>{t.auth.providerBadge}</Badge>
            </div>
            <CardTitle className="text-xl">{t.auth.registerAsProvider}</CardTitle>
            <CardDescription>
              {t.auth.registerProviderDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">&#10003;</span>
                {t.auth.providerFeature1}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">&#10003;</span>
                {t.auth.providerFeature2}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">&#10003;</span>
                {t.auth.providerFeature3}
              </li>
            </ul>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/registrieren/anbieter">
                {t.common.next}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {t.auth.hasAccount}{" "}
        <Link
          href="/anmelden"
          className="font-medium text-primary hover:underline"
        >
          {t.auth.loginNow}
        </Link>
      </p>
    </div>
  );
}
