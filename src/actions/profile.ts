"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProviderProfile(data: {
  companyName?: string;
  description?: string;
  phone?: string;
  whatsappPhone?: string;
  city?: string;
  zipCode?: string;
  serviceRadius?: number;
  categoryIds?: string[];
}) {
  const session = await auth();
  if (!session || session.user.role !== "PROVIDER") {
    return { error: "Nicht autorisiert." };
  }

  const provider = await db.providerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!provider) return { error: "Profil nicht gefunden." };

  await db.providerProfile.update({
    where: { id: provider.id },
    data: {
      companyName: data.companyName,
      description: data.description,
      phone: data.phone,
      whatsappPhone: data.whatsappPhone,
      city: data.city,
      zipCode: data.zipCode,
      serviceRadius: data.serviceRadius,
    },
  });

  // Update categories if provided
  if (data.categoryIds) {
    await db.providerCategory.deleteMany({ where: { providerId: provider.id } });
    await db.providerCategory.createMany({
      data: data.categoryIds.map((categoryId) => ({
        providerId: provider.id,
        categoryId,
      })),
    });
  }

  revalidatePath("/anbieter/profil");
  return { success: true };
}

export async function updateClientProfile(data: {
  name?: string;
  city?: string;
  zipCode?: string;
}) {
  const session = await auth();
  if (!session || session.user.role !== "CLIENT") {
    return { error: "Nicht autorisiert." };
  }

  if (data.name) {
    await db.user.update({
      where: { id: session.user.id },
      data: { name: data.name },
    });
  }

  const clientProfile = await db.clientProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (clientProfile) {
    await db.clientProfile.update({
      where: { id: clientProfile.id },
      data: {
        city: data.city,
        zipCode: data.zipCode,
      },
    });
  }

  revalidatePath("/dashboard/profil");
  return { success: true };
}

export async function getProviderPublicProfile(providerId: string) {
  return db.providerProfile.findUnique({
    where: { id: providerId },
    include: {
      user: { select: { name: true, avatarUrl: true, createdAt: true } },
      categories: { include: { category: true } },
      portfolioImages: { orderBy: { sortOrder: "asc" } },
      reviews: {
        where: { isPublic: true, deletedAt: null },
        include: {
          job: { select: { title: true, category: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      subscription: {
        select: { tier: true, status: true },
      },
    },
  });
}
