import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function AGBPage() {
  const t = await getServerTranslations();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">{t.legal.termsTitle}</h1>
          <div className="prose mt-8 max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">§ 1 Geltungsbereich</h2>
              <p>Diese AGB gelten für die Nutzung der Plattform Werkspot. Werkspot ist eine Vermittlungsplattform, die Auftraggeber und Dienstleister zusammenbringt. Werkspot ist nicht Vertragspartei der zwischen Auftraggeber und Dienstleister geschlossenen Verträge.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">§ 2 Registrierung</h2>
              <p>Die Registrierung ist für Auftraggeber kostenlos. Dienstleister erhalten eine 30-tägige kostenlose Testphase. Danach ist ein kostenpflichtiges Abonnement erforderlich. Jeder Nutzer darf nur ein Konto besitzen.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">§ 3 Aufträge und Angebote</h2>
              <p>Auftraggeber beschreiben ihre Projekte wahrheitsgemäß. Dienstleister geben verbindliche Preisangebote ab. Die Zuschlagserteilung durch den Auftraggeber stellt eine Beauftragung dar. Details der Zusammenarbeit regeln die Parteien untereinander.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">§ 4 Abonnements & Zahlung</h2>
              <p>Die Abonnements (Basic, Pro, Premium) werden monatlich abgerechnet. Die Kündigung ist jederzeit zum Ende der laufenden Abrechnungsperiode möglich. Die Zahlung erfolgt über Stripe.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">§ 5 Bewertungen</h2>
              <p>Bewertungen müssen wahrheitsgemäß und sachlich sein. Werkspot behält sich vor, unangemessene Bewertungen zu entfernen. Eine Manipulation von Bewertungen ist untersagt.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">§ 6 Haftung</h2>
              <p>Werkspot haftet nicht für die Qualität der erbrachten Dienstleistungen. Die Haftung von Werkspot ist auf die Plattformfunktionalität beschränkt. Werkspot haftet nicht für Schäden, die aus der Zusammenarbeit zwischen Auftraggeber und Dienstleister entstehen.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">§ 7 Kündigung & Sperrung</h2>
              <p>Werkspot kann Konten bei Verstößen gegen diese AGB sperren oder löschen. Nutzer können ihr Konto jederzeit löschen.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">§ 8 Schlussbestimmungen</h2>
              <p>Es gilt deutsches Recht. Gerichtsstand ist Berlin. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
