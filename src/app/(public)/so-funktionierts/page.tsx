import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowRight, FileText, MessageSquare, ThumbsUp, Search, Send, CheckCircle } from "lucide-react";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function HowItWorksPage() {
  const t = await getServerTranslations();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {t.howItWorks.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {t.howItWorks.subtitle}
              </p>
            </div>

            {/* For Clients */}
            <div className="mt-16">
              <h2 className="text-center text-2xl font-bold">{t.howItWorks.forClients}</h2>
              <p className="mt-2 text-center text-muted-foreground">{t.pricing.freeForClientsDesc}</p>
              <div className="mt-10 space-y-8">
                {[
                  { icon: FileText, title: t.howItWorks.clientStep1Title, desc: t.howItWorks.clientStep1Desc },
                  { icon: MessageSquare, title: t.howItWorks.clientStep2Title, desc: t.howItWorks.clientStep2Desc },
                  { icon: ThumbsUp, title: t.howItWorks.clientStep3Title, desc: t.howItWorks.clientStep3Desc },
                ].map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        <p className="mt-1 text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 text-center">
                <Button asChild>
                  <Link href="/registrieren/kunde">
                    {t.howItWorks.ctaClient} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* For Providers */}
            <div className="mt-20">
              <h2 className="text-center text-2xl font-bold">{t.howItWorks.forProviders}</h2>
              <p className="mt-2 text-center text-muted-foreground">{t.pricing.trial} – danach ab 29 €/Monat</p>
              <div className="mt-10 space-y-8">
                {[
                  { icon: Search, title: t.howItWorks.providerStep1Title, desc: t.howItWorks.providerStep1Desc },
                  { icon: Send, title: t.howItWorks.providerStep2Title, desc: t.howItWorks.providerStep2Desc },
                  { icon: CheckCircle, title: t.howItWorks.providerStep3Title, desc: t.howItWorks.providerStep3Desc },
                ].map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        <p className="mt-1 text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 text-center">
                <Button asChild>
                  <Link href="/registrieren/anbieter">
                    {t.pricing.registerNow} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
