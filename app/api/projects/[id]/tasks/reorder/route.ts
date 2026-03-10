import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const { orderedIds } = await req.json();

  if (!Array.isArray(orderedIds)) {
    return NextResponse.json(
      { error: "orderedIds must be an array" },
      { status: 400 }
    );
  }

  // Update each task's order in a transaction
  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await tx
        .update(tasks)
        .set({ order: i * 1000, updatedAt: new Date() })
        .where(eq(tasks.id, orderedIds[i]));
    }
  });

  Sentry.logger.info(
    Sentry.logger.fmt`Tasks reordered in project ${projectId}`,
    { projectId, taskCount: orderedIds.length }
  );

  return NextResponse.json({ success: true });
}
