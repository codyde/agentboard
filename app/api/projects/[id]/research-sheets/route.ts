import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { researchSheets } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const sheets = await db.query.researchSheets.findMany({
    where: eq(researchSheets.projectId, id),
    orderBy: [asc(researchSheets.createdAt)],
  });

  return NextResponse.json(
    sheets.map((s) => ({
      id: s.id,
      projectId: s.projectId,
      taskId: s.taskId,
      content: s.content,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }))
  );
}
