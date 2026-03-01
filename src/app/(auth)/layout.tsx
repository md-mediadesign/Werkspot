import Link from "next/link";
import { Wrench } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-2xl font-bold"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Wrench className="h-5 w-5" />
        </div>
        <span>Werkspot</span>
      </Link>

      <div className="w-full max-w-lg">{children}</div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Werkspot. Alle Rechte vorbehalten.
      </p>
    </div>
  );
}
