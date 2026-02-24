"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import type { ResearchSheet, Task } from "@/lib/types";

interface ResearchPanelProps {
  sheets: ResearchSheet[];
  tasks: Task[];
}

export default function ResearchPanel({ sheets, tasks }: ResearchPanelProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Default: expand all sheets
    return new Set(sheets.map((s) => s.id));
  });

  function toggleSheet(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function getTaskTitle(taskId: string): string {
    const task = tasks.find((t) => t.id === taskId);
    return task?.title || "Research Result";
  }

  if (sheets.length === 0) {
    return (
      <div className="w-[420px] min-w-[420px] border-l border-border-primary bg-bg-secondary flex flex-col items-center justify-center py-16">
        <FileText size={32} className="text-text-tertiary mb-3" />
        <p className="text-sm text-text-secondary">No research results yet</p>
        <p className="text-xs text-text-tertiary mt-1">
          Execute research tasks to see results here
        </p>
      </div>
    );
  }

  return (
    <div className="w-[420px] min-w-[420px] border-l border-border-primary bg-bg-secondary flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-border-primary flex items-center gap-2">
        <FileText size={14} className="text-accent-primary" />
        <span className="text-sm font-medium text-text-primary">
          Research Results
        </span>
        <span className="text-[11px] text-text-tertiary ml-auto">
          {sheets.length} {sheets.length === 1 ? "result" : "results"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sheets.map((sheet) => {
          const isExpanded = expandedIds.has(sheet.id);
          return (
            <div
              key={sheet.id}
              className="border-b border-border-primary"
            >
              <button
                onClick={() => toggleSheet(sheet.id)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-bg-hover transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown size={14} className="text-text-tertiary shrink-0" />
                ) : (
                  <ChevronRight size={14} className="text-text-tertiary shrink-0" />
                )}
                <span className="text-sm font-medium text-text-primary truncate">
                  {getTaskTitle(sheet.taskId)}
                </span>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 animate-fade-in">
                  <div className="prose-invert text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {sheet.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
