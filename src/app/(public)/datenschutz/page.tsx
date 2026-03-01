import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function DatenschutzPage() {
  const t = await getServerTranslations();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">{t.legal.privacyTitle}</h1>
          <div className="prose mt-8 max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Verantwortlicher</h2>
              <p>Werkspot GmbH (i.Gr.), Musterstraße 1, 10115 Berlin. E-Mail: datenschutz@werkspot.de</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
              <p>Wir erheben personenbezogene Daten, wenn Sie sich registrieren, einen Auftrag erstellen oder ein Angebot abgeben. Dies umfasst: Name, E-Mail-Adresse, Telefonnummer, Adressdaten und ggf. Zahlungsinformationen (über Stripe).</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">3. Zweck der Datenverarbeitung</h2>
              <p>Die Daten werden verarbeitet zur: Bereitstellung der Plattform, Vermittlung zwischen Auftraggebern und Dienstleistern, Abrechnung von Abonnements, Kommunikation und Benachrichtigungen.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Rechtsgrundlage</h2>
              <p>Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung), Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) und Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Weitergabe an Dritte</h2>
              <p>Wir geben Daten nur weiter an: Stripe (Zahlungsabwicklung), E-Mail-Dienstleister (Benachrichtigungen), WhatsApp/Meta (Premium-Benachrichtigungen, nur mit Einwilligung).</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Ihre Rechte</h2>
              <p>Sie haben das Recht auf: Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO), Widerspruch (Art. 21 DSGVO).</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Löschung & Kontolöschung</h2>
              <p>Sie können Ihr Konto jederzeit in den Profileinstellungen löschen oder uns per E-Mail kontaktieren. Ihre Daten werden daraufhin innerhalb von 30 Tagen gelöscht.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Cookies</h2>
              <p>Wir verwenden technisch notwendige Cookies für die Sitzungsverwaltung. Analytische Cookies werden nur mit Ihrer Einwilligung gesetzt.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
