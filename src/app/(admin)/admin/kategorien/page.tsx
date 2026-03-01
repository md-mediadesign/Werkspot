import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toggleCategory } from "@/actions/admin";
import { CategoryForm } from "./category-form";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function KategorienPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const t = await getServerTranslations();

  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t.admin.categories}</h2>
        <p className="text-muted-foreground">
          {t.admin.categoriesSubtitle}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.admin.createCategory}</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pt-4 font-medium text-muted-foreground">{t.admin.categoryName}</th>
                  <th className="pb-3 pt-4 font-medium text-muted-foreground">{t.admin.slug}</th>
                  <th className="pb-3 pt-4 font-medium text-muted-foreground">{t.admin.icon}</th>
                  <th className="pb-3 pt-4 font-medium text-muted-foreground text-center">{t.admin.sortOrder}</th>
                  <th className="pb-3 pt-4 font-medium text-muted-foreground">{t.admin.status}</th>
                  <th className="pb-3 pt-4 font-medium text-muted-foreground text-right">{t.admin.actions}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{category.name}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">
                      {category.slug}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {category.icon || "\u2013"}
                    </td>
                    <td className="py-3 text-center text-muted-foreground">
                      {category.sortOrder}
                    </td>
                    <td className="py-3">
                      {category.isActive ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {t.admin.activeStatus}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                          {t.admin.inactive}
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <form
                        action={async () => {
                          "use server";
                          await toggleCategory(category.id);
                        }}
                      >
                        <Button
                          type="submit"
                          variant={category.isActive ? "destructive" : "outline"}
                          size="xs"
                        >
                          {category.isActive ? t.admin.deactivate : t.admin.activate}
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      {t.admin.noCategoriesFound}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        {categories.length} {t.admin.categoriesTotal}
      </p>
    </div>
  );
}
