import { useState, useCallback, useEffect } from "react";

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
}

const factorial = (n: number): number => {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity;
  let result = 1;
  for (let i = 2; i <= Math.floor(n); i++) result *= i;
  return result;
};

export function useCalculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);
  const [activeOp, setActiveOp] = useState<string | null>(null);
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isRadians, setIsRadians] = useState(true);

  const inputDigit = useCallback((digit: string) => {
    if (resetNext) {
      setDisplay(digit);
      setResetNext(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
    setActiveOp(null);
  }, [display, resetNext]);

  const inputDecimal = useCallback(() => {
    if (resetNext) {
      setDisplay("0.");
      setResetNext(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }, [display, resetNext]);

  const clear = useCallback(() => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setResetNext(false);
    setActiveOp(null);
    setExpression("");
  }, []);

  const toggleSign = useCallback(() => {
    setDisplay(String(parseFloat(display) * -1));
  }, [display]);

  const inputPercent = useCallback(() => {
    setDisplay(String(parseFloat(display) / 100));
  }, [display]);

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? 0 : a / b;
      case "xʸ": return Math.pow(a, b);
      case "ʸ√x": return Math.pow(a, 1 / b);
      default: return b;
    }
  };

  const formatNum = (n: number): string => {
    const f = parseFloat(n.toPrecision(12));
    return String(f);
  };

  const handleOperation = useCallback((op: string) => {
    const current = parseFloat(display);
    if (previousValue !== null && operation && !resetNext) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
      setExpression(formatNum(result) + " " + op);
    } else {
      setPreviousValue(current);
      setExpression(formatNum(current) + " " + op);
    }
    setOperation(op);
    setResetNext(true);
    setActiveOp(op);
  }, [display, previousValue, operation, resetNext]);

  const handleEquals = useCallback(() => {
    if (previousValue === null || !operation) return;
    const current = parseFloat(display);
    const result = calculate(previousValue, current, operation);
    const formatted = parseFloat(result.toPrecision(12));
    const expr = formatNum(previousValue) + " " + operation + " " + formatNum(current) + " =";

    setHistory(prev => [{
      id: Date.now().toString(),
      expression: expr,
      result: String(formatted),
    }, ...prev]);

    setDisplay(String(formatted));
    setExpression(expr);
    setPreviousValue(null);
    setOperation(null);
    setResetNext(true);
    setActiveOp(null);
  }, [display, previousValue, operation]);

  const applyScientific = useCallback((fn: string) => {
    const current = parseFloat(display);
    let result: number;
    let label = fn;

    const toAngle = (v: number) => isRadians ? v : (v * Math.PI) / 180;

    switch (fn) {
      case "sin": result = Math.sin(toAngle(current)); break;
      case "cos": result = Math.cos(toAngle(current)); break;
      case "tan": result = Math.tan(toAngle(current)); break;
      case "sin⁻¹": result = isRadians ? Math.asin(current) : (Math.asin(current) * 180) / Math.PI; break;
      case "cos⁻¹": result = isRadians ? Math.acos(current) : (Math.acos(current) * 180) / Math.PI; break;
      case "tan⁻¹": result = isRadians ? Math.atan(current) : (Math.atan(current) * 180) / Math.PI; break;
      case "ln": result = Math.log(current); break;
      case "log₁₀": result = Math.log10(current); break;
      case "√": result = Math.sqrt(current); label = "√"; break;
      case "x²": result = current * current; label = "²"; break;
      case "x³": result = current * current * current; label = "³"; break;
      case "eˣ": result = Math.exp(current); break;
      case "10ˣ": result = Math.pow(10, current); break;
      case "1/x": result = 1 / current; break;
      case "x!": result = factorial(current); break;
      case "π": result = Math.PI; break;
      case "e": result = Math.E; break;
      case "Rand": result = Math.random(); break;
      default: result = current;
    }

    const formatted = parseFloat(result.toPrecision(12));
    const exprStr = `${label}(${formatNum(current)})`;
    setExpression(exprStr);
    setDisplay(String(formatted));
    setResetNext(true);
  }, [display, isRadians]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const deleteHistoryEntry = useCallback((id: string) => {
    setHistory(prev => prev.filter(e => e.id !== id));
  }, []);

  const toggleAngleMode = useCallback(() => {
    setIsRadians(prev => !prev);
  }, []);

  const formatDisplay = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return "Error";
    if (value.endsWith(".") || value.endsWith(".0")) return value;
    if (value.includes(".") && value.endsWith("0")) return value;
    if (Math.abs(num) > 999999999) return num.toExponential(5);
    if (value.includes(".")) {
      const parts = value.split(".");
      return Number(parts[0]).toLocaleString() + "." + parts[1];
    }
    return num.toLocaleString();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        inputDigit(e.key);
      } else if (e.key === ".") {
        inputDecimal();
      } else if (e.key === "+" ) {
        handleOperation("+");
      } else if (e.key === "-") {
        handleOperation("−");
      } else if (e.key === "*") {
        handleOperation("×");
      } else if (e.key === "/") {
        e.preventDefault();
        handleOperation("÷");
      } else if (e.key === "Enter" || e.key === "=") {
        handleEquals();
      } else if (e.key === "Backspace") {
        // Remove last character or reset to 0
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
      } else if (e.key === "Escape") {
        clear();
      } else if (e.key === "%") {
        inputPercent();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputDigit, inputDecimal, handleOperation, handleEquals, clear, inputPercent]);

  return {
    display: formatDisplay(display),
    activeOp,
    expression,
    history,
    isRadians,
    inputDigit,
    inputDecimal,
    clear,
    toggleSign,
    inputPercent,
    handleOperation,
    handleEquals,
    applyScientific,
    clearHistory,
    deleteHistoryEntry,
    toggleAngleMode,
    displayValue: display,
  };
}
