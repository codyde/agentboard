import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, tasks } from "@/lib/db/schema";

export async function GET() {
  const allProjects = await db.query.projects.findMany({
    with: { tasks: true },
  });

  // Sort projects by createdAt in descending order (workaround for Drizzle ORM v0.45.1 bug)
  allProjects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const result = allProjects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    identifier: p.identifier,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    tasks: p.tasks.map((t) => ({
      id: t.id,
      projectId: t.projectId,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      output: t.output,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    })),
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, identifier } = body;

  const [project] = await db
    .insert(projects)
    .values({
      name,
      description: description || "",
      identifier,
      status: "idle",
    })
    .returning();

  return NextResponse.json({
    id: project.id,
    name: project.name,
    description: project.description,
    identifier: project.identifier,
    status: project.status,
    createdAt: project.createdAt.toISOString(),
    tasks: [],
  });
}
