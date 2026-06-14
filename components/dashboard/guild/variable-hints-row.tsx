"use client";

import { Tooltip } from "@heroui/tooltip";

export interface VariableHint {
  variable: string;
  description: string;
}

interface VariableHintsRowProps {
  hints: VariableHint[];
  onAppend: (variable: string) => void;
  label?: string;
}

export function VariableHintsRow({
  hints,
  onAppend,
  label,
}: VariableHintsRowProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {label && (
        <span className="text-xs text-default-400 mr-2">{label}</span>
      )}
      {hints.map((hint) => (
        <Tooltip key={hint.variable} content={hint.description}>
          <button
            type="button"
            onClick={() => onAppend(hint.variable)}
            className="text-xs px-2 py-1 rounded-full bg-default-100 hover:bg-primary/20 hover:text-primary transition-colors font-mono"
          >
            {hint.variable}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}
