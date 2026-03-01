import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobId } = await params;

  const job = await db.job.findUnique({
    where: { id: jobId },
    include: {
      category: { select: { name: true } },
      client: { include: { user: { select: { name: true } } } },
      images: true,
      _count: { select: { bids: true } },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // If provider, check for existing bid
  let existingBid = null;
  if (session.user.role === "PROVIDER") {
    const provider = await db.providerProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (provider) {
      existingBid = await db.bid.findUnique({
        where: { jobId_providerId: { jobId, providerId: provider.id } },
        select: { id: true, amount: true, message: true, status: true },
      });
    }
  }

  return NextResponse.json({
    ...job,
    existingBid,
  });
}
