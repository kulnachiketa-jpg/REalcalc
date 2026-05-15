import { cn } from "@/lib/utils";

type ButtonType = "number" | "function" | "operator";

interface CalcButtonProps {
  label: string;
  type?: ButtonType;
  wide?: boolean;
  active?: boolean;
  onClick: () => void;
}

const typeStyles: Record<ButtonType, string> = {
  number: "bg-[hsl(var(--btn-number))] text-[hsl(var(--btn-number-foreground))] active:bg-[hsl(0,0%,30%)]",
  function: "bg-[hsl(var(--btn-function))] text-[hsl(var(--btn-function-foreground))] active:bg-[hsl(0,0%,80%)]",
  operator: "bg-[hsl(var(--btn-operator))] text-[hsl(var(--btn-operator-foreground))] active:bg-[hsl(36,100%,70%)]",
};

export default function CalcButton({ label, type = "number", wide = false, active = false, onClick }: CalcButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full text-[1.75rem] font-light h-[72px] transition-colors duration-100 select-none",
        wide ? "col-span-2 w-full text-left pl-7" : "w-[72px]",
        active
          ? "bg-[hsl(var(--btn-operator-foreground))] text-[hsl(var(--btn-operator))]"
          : typeStyles[type]
      )}
    >
      {label}
    </button>
  );
}
