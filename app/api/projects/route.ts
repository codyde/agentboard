import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { db } from "@/lib/db";
import { projects, tasks } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  // Fetch all projects ordered by createdAt
  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.createdAt));

  // Fetch all tasks for these projects
  const allTasks = await db
    .select()
    .from(tasks)
    .orderBy(tasks.createdAt);

  // Group tasks by project
  const tasksByProject = allTasks.reduce((acc, task) => {
    if (!acc[task.projectId]) {
      acc[task.projectId] = [];
    }
    acc[task.projectId].push(task);
    return acc;
  }, {} as Record<string, typeof allTasks>);

  // Map the results
  const result = allProjects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    identifier: p.identifier,
    mode: p.mode,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    tasks: (tasksByProject[p.id] || []).map((t) => ({
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
  const { name, description, identifier, mode } = body;

  const [project] = await db
    .insert(projects)
    .values({
      name,
      description: description || "",
      identifier,
      mode: mode || "build",
      status: "idle",
    })
    .returning();

  Sentry.logger.info(
    Sentry.logger.fmt`Project created: ${project.name}`,
    {
      projectId: project.id,
      projectName: project.name,
      identifier: project.identifier,
      status: project.status,
    }
  );

  Sentry.metrics.count("project.created", 1, {
    attributes: { mode: project.mode },
  });

  return NextResponse.json({
    id: project.id,
    name: project.name,
    description: project.description,
    identifier: project.identifier,
    mode: project.mode,
    status: project.status,
    createdAt: project.createdAt.toISOString(),
    tasks: [],
  });
}
