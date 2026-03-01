import { cookies } from "next/headers";
import { type Locale, defaultLocale, getDictionary } from "./index";

const COOKIE_NAME = "werkspot-locale";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(COOKIE_NAME)?.value as Locale | undefined;
  return locale ?? defaultLocale;
}

export async function getServerTranslations() {
  const locale = await getLocale();
  return getDictionary(locale);
}
