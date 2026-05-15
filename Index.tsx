import { useCalculator } from "@/hooks/useCalculator";
import CalcButton from "@/components/CalcButton";
import ScientificPanel from "@/components/ScientificPanel";
import { useState } from "react";
import { Clock, Trash2, X, FlaskConical } from "lucide-react";

const Index = () => {
  const calc = useCalculator();
  const [showHistory, setShowHistory] = useState(false);
  const [showScientific, setShowScientific] = useState(false);

  const displayLen = calc.display.length;
  const fontSize = displayLen > 9 ? (displayLen > 12 ? "text-4xl" : "text-5xl") : "text-6xl";

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-[330px] flex flex-col gap-3 p-4 relative">
        
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Clock size={20} />
          </button>
          <button
            onClick={() => setShowScientific(!showScientific)}
            className={`transition-colors ${showScientific ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <FlaskConical size={20} />
          </button>
        </div>

        {/* History panel */}
        {showHistory && (
          <div className="absolute inset-0 bg-background z-10 flex flex-col rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-foreground font-medium text-lg">History</span>
              <div className="flex gap-3">
                {calc.history.length > 0 && (
                  <button onClick={calc.clearHistory} className="text-destructive hover:text-destructive/80 transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
                <button onClick={() => setShowHistory(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {calc.history.length === 0 ? (
                <p className="text-muted-foreground text-center mt-8 text-sm">No history yet</p>
              ) : (
                calc.history.map(entry => (
                  <div key={entry.id} className="flex items-start justify-between group">
                    <div className="text-right flex-1">
                      <p className="text-muted-foreground text-sm">{entry.expression}</p>
                      <p className="text-foreground text-xl font-light">{entry.result}</p>
                    </div>
                    <button
                      onClick={() => calc.deleteHistoryEntry(entry.id)}
                      className="text-muted-foreground hover:text-destructive ml-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {calc.history.length > 0 && (
              <div className="p-3 border-t border-border">
                <button
                  onClick={calc.clearHistory}
                  className="w-full py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
                >
                  Clear History
                </button>
              </div>
            )}
          </div>
        )}

        {/* Display */}
        <div className="h-[120px] flex flex-col items-end justify-end px-2 pb-2">
          {calc.expression && (
            <span className="text-muted-foreground text-sm mb-1 tracking-wide">
              {calc.expression}
            </span>
          )}
          <span className={`${fontSize} font-light text-foreground tracking-tight`}>
            {calc.display}
          </span>
        </div>

        {/* Scientific panel */}
        {showScientific && (
          <ScientificPanel
            onFunction={calc.applyScientific}
            onOperation={calc.handleOperation}
            isRadians={calc.isRadians}
            onToggleAngle={calc.toggleAngleMode}
          />
        )}

        {/* Title */}
        <h1 className="text-center text-sm font-semibold text-foreground tracking-wide mb-1">Pro Calculator</h1>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-3 justify-items-center">
          <CalcButton label={calc.displayValue !== "0" ? "C" : "AC"} type="function" onClick={calc.clear} />
          <CalcButton label="+/−" type="function" onClick={calc.toggleSign} />
          <CalcButton label="%" type="function" onClick={calc.inputPercent} />
          <CalcButton label="÷" type="operator" active={calc.activeOp === "÷"} onClick={() => calc.handleOperation("÷")} />

          <CalcButton label="7" onClick={() => calc.inputDigit("7")} />
          <CalcButton label="8" onClick={() => calc.inputDigit("8")} />
          <CalcButton label="9" onClick={() => calc.inputDigit("9")} />
          <CalcButton label="×" type="operator" active={calc.activeOp === "×"} onClick={() => calc.handleOperation("×")} />

          <CalcButton label="4" onClick={() => calc.inputDigit("4")} />
          <CalcButton label="5" onClick={() => calc.inputDigit("5")} />
          <CalcButton label="6" onClick={() => calc.inputDigit("6")} />
          <CalcButton label="−" type="operator" active={calc.activeOp === "−"} onClick={() => calc.handleOperation("−")} />

          <CalcButton label="1" onClick={() => calc.inputDigit("1")} />
          <CalcButton label="2" onClick={() => calc.inputDigit("2")} />
          <CalcButton label="3" onClick={() => calc.inputDigit("3")} />
          <CalcButton label="+" type="operator" active={calc.activeOp === "+"} onClick={() => calc.handleOperation("+")} />

          <CalcButton label="0" wide onClick={() => calc.inputDigit("0")} />
          <CalcButton label="." onClick={calc.inputDecimal} />
          <CalcButton label="=" type="operator" onClick={calc.handleEquals} />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-2">By Nachiket</p>
      </div>
    </div>
  );
};

export default Index;
