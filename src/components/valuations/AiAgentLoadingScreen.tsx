import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Loader2, Search, Sparkles, TerminalSquare } from "lucide-react";
import magnifyImg from "@/assets/magnifi.png";

type Props = {
  domain: string;
};

const AGENT_LOGS = [
  "Understanding request context and validating domain format",
  "Gathering market signals from comparable sales",
  "Analyzing SEO, authority, and traffic indicators",
  "Estimating value range with valuation model",
  "Packaging final report for display",
];

const getNowTime = () =>
  new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());

export default function AiAgentLoadingScreen({ domain }: Props) {
  const safeDomain = useMemo(
    () => (domain.trim() ? domain.trim() : "example.com"),
    [domain],
  );
  const [messageText, setMessageText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [visibleResultRows, setVisibleResultRows] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const logsContainerRef = useRef<HTMLDivElement | null>(null);
  const [isLogStreamingDone, setIsLogStreamingDone] = useState(false);

  useEffect(() => {
    setMessageText("");
    setSearchText("");
    setVisibleResultRows(0);
    setVisibleLogs([]);
    setIsLogStreamingDone(false);

    let isCancelled = false;
    const cleanupFns: Array<() => void> = [];

    const intro = `Got it. Running AI valuation workflow for ${safeDomain}`;
    let introIndex = 0;
    const introTimer = window.setInterval(() => {
      if (isCancelled) return;
      introIndex += 1;
      setMessageText(intro.slice(0, introIndex));
      if (introIndex >= intro.length) {
        window.clearInterval(introTimer);
      }
    }, 28);

    const searchStart = window.setTimeout(() => {
      let searchIndex = 0;
      const searchTimer = window.setInterval(() => {
        if (isCancelled) return;
        searchIndex += 1;
        setSearchText(safeDomain.slice(0, searchIndex));
        if (searchIndex >= safeDomain.length) {
          window.clearInterval(searchTimer);
        }
      }, 48);
    }, 500);

    const resultsStart = window.setTimeout(() => {
      let row = 0;
      const resultsTimer = window.setInterval(() => {
        if (isCancelled) return;
        row += 1;
        setVisibleResultRows(Math.min(row, 4));
        if (row >= 4) {
          window.clearInterval(resultsTimer);
        }
      }, 320);
    }, 900);

    const logsStart = window.setTimeout(() => {
      const typeLogLine = (line: string, onDone: () => void) => {
        let charIndex = 0;
        setVisibleLogs((prev) => [...prev, ""]);
        const timer = window.setInterval(() => {
          if (isCancelled) return;
          charIndex += 1;
          setVisibleLogs((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = line.slice(0, charIndex);
            return copy;
          });
          if (charIndex >= line.length) {
            window.clearInterval(timer);
            onDone();
          }
        }, 18);
        cleanupFns.push(() => window.clearInterval(timer));
      };

      const streamNextLine = (index: number) => {
        if (isCancelled) return;
        if (index >= AGENT_LOGS.length) {
          setIsLogStreamingDone(true);
          return;
        }
        const line = `[${getNowTime()}] ${AGENT_LOGS[index]}`;
        typeLogLine(line, () => {
          const pauseTimer = window.setTimeout(() => {
            streamNextLine(index + 1);
          }, 280);
          cleanupFns.push(() => window.clearTimeout(pauseTimer));
        });
      };

      streamNextLine(0);
    }, 1200);
    cleanupFns.push(() => window.clearTimeout(logsStart));

    return () => {
      isCancelled = true;
      window.clearInterval(introTimer);
      window.clearTimeout(searchStart);
      window.clearTimeout(resultsStart);
      cleanupFns.forEach((fn) => fn());
    };
  }, [safeDomain]);

  useEffect(() => {
    const el = logsContainerRef.current;
    if (!el) return;
    if (isLogStreamingDone) {
      el.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [visibleLogs, isLogStreamingDone]);

  return (
    <div className="px-4 pb-12 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 min-h-[65vh] flex flex-col justify-center">
      <div className="rounded-xl border bg-card/90 backdrop-blur p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 text-primary mb-3">
          <Bot className="h-4 w-4" />
          <span className="text-sm font-medium">AI Agent Session</span>
          <Loader2 className="h-4 w-4 animate-spin ml-auto text-muted-foreground" />
        </div>
        <p className="text-sm sm:text-base font-medium min-h-6">
          {messageText}
        </p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        <div className="h-11 border-b bg-muted/40 flex items-center px-4 gap-2">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-yellow-400" />
          <span className="size-2.5 rounded-full bg-green-400" />
          <span className="text-xs text-muted-foreground ml-3">
            Valuation Runner
          </span>
        </div>
        <div className="relative p-4 sm:p-5 space-y-4 overflow-hidden">
          <div className="pointer-events-none absolute left-1/2 top-[92px] -translate-x-1/2 z-10 hidden sm:block">
            <div className="scanner-glass">
              <img src={magnifyImg} alt="" className="h-20 w-20 object-contain" />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{searchText}</span>
          </div>

          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={`rounded-md border p-3 transition-all ${
                  index < visibleResultRows
                    ? "opacity-100 translate-x-0"
                    : "opacity-20 -translate-x-2"
                }`}
              >
                <div className="h-2.5 w-1/3 rounded bg-primary/30 mb-2" />
                <div className="h-2 w-11/12 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium mb-3">
          <TerminalSquare className="h-4 w-4 text-primary" />
          Live execution logs
          <Sparkles className="h-4 w-4 text-muted-foreground ml-auto animate-pulse" />
        </div>
        <div
          ref={logsContainerRef}
          className="space-y-2 font-mono text-xs sm:text-sm max-h-40 overflow-y-auto pr-1"
        >
          {visibleLogs.length === 0 ? (
            <p className="text-muted-foreground">Initializing tools...</p>
          ) : (
            visibleLogs.map((line) => (
              <p key={line} className="text-muted-foreground">
                {line}
              </p>
            ))
          )}
        </div>
      </div>
      <style>{`
        .scanner-glass {
          position: relative;
          transform-origin: 50% 50%;
          animation: scan-lines 2.8s cubic-bezier(0.22, 0.7, 0.2, 1) infinite;
        }

        .scanner-glass::after {
          content: "";
          position: absolute;
          inset: 50%;
          width: 42px;
          height: 42px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background: radial-gradient(
            circle,
            hsl(var(--primary) / 0.18) 0%,
            hsl(var(--primary) / 0.06) 45%,
            transparent 72%
          );
          z-index: -1;
          animation: scan-pulse 2.8s ease-in-out infinite;
        }

        @keyframes scan-lines {
          0% {
            transform: translateY(0) scale(1) rotate(-7deg);
          }
          16% {
            transform: translateY(0) scale(1.04) rotate(-3deg);
          }
          50% {
            transform: translateY(108px) scale(1.1) rotate(8deg);
          }
          72% {
            transform: translateY(108px) scale(1.04) rotate(5deg);
          }
          100% {
            transform: translateY(0) scale(1) rotate(-7deg);
          }
        }

        @keyframes scan-pulse {
          0%,
          100% {
            opacity: 0.35;
            transform: translate(-50%, -50%) scale(0.9);
          }
          50% {
            opacity: 0.75;
            transform: translate(-50%, -50%) scale(1.18);
          }
        }
      `}</style>
    </div>
  );
}
