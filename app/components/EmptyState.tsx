"use client";

import { Layers, Plus, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  onCreateProject: () => void;
}

export default function EmptyState({ onCreateProject }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-bg-primary">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-accent-muted flex items-center justify-center mb-6">
          <Layers size={28} className="text-accent-primary" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          Welcome to AgentBoard
        </h2>
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          Create a project, define your tasks, and let the AI agent execute them
          sequentially. Watch as each task progresses from todo to done in
          real-time.
        </p>
        <div className="flex flex-col gap-3 items-center">
          <button
            onClick={onCreateProject}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-accent-primary text-white hover:bg-accent-hover transition-colors"
          >
            <Plus size={16} />
            Create your first project
          </button>
          <div className="flex items-center gap-6 mt-4 text-xs text-text-tertiary">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-bg-tertiary flex items-center justify-center text-[10px] font-mono">
                1
              </span>
              Create project
            </span>
            <ArrowRight size={12} />
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-bg-tertiary flex items-center justify-center text-[10px] font-mono">
                2
              </span>
              Add tasks
            </span>
            <ArrowRight size={12} />
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-bg-tertiary flex items-center justify-center text-[10px] font-mono">
                3
              </span>
              Execute build
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
