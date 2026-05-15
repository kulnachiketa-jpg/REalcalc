import { cn } from "@/lib/utils";
import { useState } from "react";

interface ScientificPanelProps {
  onFunction: (fn: string) => void;
  onOperation: (op: string) => void;
  isRadians: boolean;
  onToggleAngle: () => void;
}

const SciBtn = ({ label, onClick, small }: { label: string; onClick: () => void; small?: boolean }) => (
  <button
    onClick={onClick}
    className={cn(
      "rounded-lg bg-secondary text-secondary-foreground font-normal transition-colors active:bg-muted",
      small ? "text-xs py-2.5 px-1" : "text-sm py-2.5 px-1"
    )}
  >
    {label}
  </button>
);

export default function ScientificPanel({ onFunction, onOperation, isRadians, onToggleAngle }: ScientificPanelProps) {
  const [showInverse, setShowInverse] = useState(false);

  return (
    <div className="grid grid-cols-5 gap-1.5 mb-2">
      <SciBtn label={showInverse ? "2nd" : "2nd"} onClick={() => setShowInverse(!showInverse)} />
      <SciBtn label={isRadians ? "Rad" : "Deg"} onClick={onToggleAngle} />
      <SciBtn label={showInverse ? "sin⁻¹" : "sin"} onClick={() => onFunction(showInverse ? "sin⁻¹" : "sin")} />
      <SciBtn label={showInverse ? "cos⁻¹" : "cos"} onClick={() => onFunction(showInverse ? "cos⁻¹" : "cos")} />
      <SciBtn label={showInverse ? "tan⁻¹" : "tan"} onClick={() => onFunction(showInverse ? "tan⁻¹" : "tan")} />

      <SciBtn label={showInverse ? "eˣ" : "ln"} onClick={() => onFunction(showInverse ? "eˣ" : "ln")} />
      <SciBtn label={showInverse ? "10ˣ" : "log₁₀"} onClick={() => onFunction(showInverse ? "10ˣ" : "log₁₀")} />
      <SciBtn label="x²" onClick={() => onFunction("x²")} />
      <SciBtn label="x³" onClick={() => onFunction("x³")} />
      <SciBtn label="xʸ" onClick={() => onOperation("xʸ")} />

      <SciBtn label="√" onClick={() => onFunction("√")} />
      <SciBtn label="ʸ√x" onClick={() => onOperation("ʸ√x")} />
      <SciBtn label="x!" onClick={() => onFunction("x!")} />
      <SciBtn label="1/x" onClick={() => onFunction("1/x")} />
      <SciBtn label="Rand" onClick={() => onFunction("Rand")} />

      <SciBtn label="π" onClick={() => onFunction("π")} />
      <SciBtn label="e" onClick={() => onFunction("e")} />
      <div className="col-span-3" />
    </div>
  );
}
