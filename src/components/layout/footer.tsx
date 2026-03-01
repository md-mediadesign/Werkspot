"use client";

import Link from "next/link";
import { Wrench } from "lucide-react";
import { useTranslations } from "@/components/locale-provider";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Wrench className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Werkspot</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              {t.common.claim}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t.footer.clients}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/registrieren/kunde" className="text-sm text-muted-foreground hover:text-foreground">
                  {t.footer.registerFree}
                </Link>
              </li>
              <li>
                <Link href="/so-funktionierts" className="text-sm text-muted-foreground hover:text-foreground">
                  {t.footer.howItWorks}
                </Link>
              </li>
              <li>
                <Link href="/kategorien" className="text-sm text-muted-foreground hover:text-foreground">
                  {t.footer.categories}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t.footer.providers}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/registrieren/anbieter" className="text-sm text-muted-foreground hover:text-foreground">
                  {t.footer.startAsProvider}
                </Link>
              </li>
              <li>
                <Link href="/preise" className="text-sm text-muted-foreground hover:text-foreground">
                  {t.footer.pricingPackages}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t.footer.legal}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/impressum" className="text-sm text-muted-foreground hover:text-foreground">
                  {t.footer.imprint}
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-sm text-muted-foreground hover:text-foreground">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-sm text-muted-foreground hover:text-foreground">
                  {t.footer.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Werkspot. {t.footer.allRightsReserved}
        </div>
      </div>
    </footer>
  );
}
