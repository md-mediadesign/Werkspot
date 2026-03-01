import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function ImpressumPage() {
  const t = await getServerTranslations();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">{t.legal.imprintTitle}</h1>
          <div className="prose mt-8 max-w-none text-muted-foreground">
            <h2 className="text-xl font-semibold text-foreground">Angaben gemäß § 5 TMG</h2>
            <p>
              Werkspot GmbH (i.Gr.)<br />
              Musterstraße 1<br />
              10115 Berlin<br />
              Deutschland
            </p>
            <h2 className="text-xl font-semibold text-foreground">Kontakt</h2>
            <p>
              Telefon: +49 (0) 30 12345678<br />
              E-Mail: info@werkspot.de
            </p>
            <h2 className="text-xl font-semibold text-foreground">Vertreten durch</h2>
            <p>Geschäftsführer: [Name eintragen]</p>
            <h2 className="text-xl font-semibold text-foreground">Registereintrag</h2>
            <p>
              Eingetragen im Handelsregister.<br />
              Registergericht: Amtsgericht Berlin-Charlottenburg<br />
              Registernummer: HRB [Nummer eintragen]
            </p>
            <h2 className="text-xl font-semibold text-foreground">Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
              DE [Nummer eintragen]
            </p>
            <h2 className="text-xl font-semibold text-foreground">Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit.
              Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren
              vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
