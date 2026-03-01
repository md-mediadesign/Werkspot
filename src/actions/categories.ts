"use server";

import { db } from "@/lib/db";

export async function getCategories() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
    },
  });

  return categories;
}
