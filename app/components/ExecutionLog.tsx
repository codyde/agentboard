"use client";

import { useEffect, useRef } from "react";
import {
  Terminal,
  Info,
  Wrench,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import type { ExecutionLogEntry } from "@/lib/types";

interface ExecutionLogProps {
  logs: ExecutionLogEntry[];
  isExecuting: boolean;
}

const ICON_MAP = {
  info: { icon: Info, color: "text-text-secondary" },
  tool_use: { icon: Wrench, color: "text-accent-primary" },
  result: { icon: CheckCircle2, color: "text-success" },
  error: { icon: XCircle, color: "text-error" },
  progress: { icon: Loader2, color: "text-warning" },
};

export default function ExecutionLog({ logs, isExecuting }: ExecutionLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-[380px] min-w-[380px] border-l border-border-primary flex flex-col bg-bg-primary">
      {/* Header */}
      <div className="px-4 h-[44px] flex items-center gap-2 border-b border-border-primary bg-bg-secondary">
        <Terminal size={14} className="text-text-tertiary" />
        <span className="text-xs font-medium text-text-secondary">
          Execution Log
        </span>
        {isExecuting && (
          <Loader2 size={12} className="animate-spin text-accent-primary ml-auto" />
        )}
        {!isExecuting && logs.length > 0 && (
          <span className="text-[10px] text-text-tertiary ml-auto font-mono">
            {logs.length} entries
          </span>
        )}
      </div>

      {/* Log entries */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-1">
        {logs.map((log) => {
          const cfg = ICON_MAP[log.type];
          const Icon = cfg.icon;
          const time = new Date(log.timestamp).toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          return (
            <div
              key={log.id}
              className="flex gap-2 py-1.5 px-2 rounded hover:bg-bg-hover group animate-slide-in"
            >
              <Icon
                size={13}
                className={`flex-shrink-0 mt-0.5 ${cfg.color} ${
                  log.type === "progress" ? "animate-spin" : ""
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-primary leading-relaxed break-words font-mono">
                  {log.content}
                </p>
                <span className="text-[10px] text-text-tertiary">{time}</span>
              </div>
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Terminal size={24} className="text-text-tertiary mb-2" />
            <p className="text-xs text-text-tertiary">
              Execution output will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
