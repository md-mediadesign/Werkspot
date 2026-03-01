import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "PROVIDER") {
    const provider = await db.providerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        categories: { select: { categoryId: true } },
      },
    });

    if (!provider) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      companyName: provider.companyName,
      description: provider.description,
      phone: provider.phone,
      whatsappPhone: provider.whatsappPhone,
      city: provider.city,
      zipCode: provider.zipCode,
      serviceRadius: provider.serviceRadius,
      categoryIds: provider.categories.map((c) => c.categoryId),
    });
  }

  return NextResponse.json({ error: "Invalid role" }, { status: 400 });
}
