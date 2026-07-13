"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type Msg = { from: "user" | "bot"; text: string };

const GREETING =
  "Hi! I'm the Marketcap assistant 👋 Ask me anything about using the app — buying, selling, charts, your virtual cash…";

const QUICK = ["How do I buy a stock?", "How do I sell?", "Is the money real?", "How do I read candles?"];

// Keyword-matched answer base. First match wins, so more specific
// topics come before general ones.
const ANSWERS: { keys: string[]; answer: string }[] = [
  {
    keys: ["withdraw", "cash out", "real money", "money real", "is this real", "deposit"],
    answer:
      "No real money is involved. Every account gets $100,000 of virtual cash to practice with — you can't deposit or withdraw, and nothing you do here touches a real bank or broker. It's a risk-free trading simulator with real live prices.",
  },
  {
    keys: ["buy", "purchase", "invest in"],
    answer:
      "To buy: search a stock in the bar at the top of the dashboard (or pick one from Market Movers), open it, enter how many shares in the Buy box, and press Buy. It purchases at the live market price using your virtual cash — you can't spend more than you have.",
  },
  {
    keys: ["sell", "sold", "exit"],
    answer:
      "To sell: open a stock you own (click it in Holdings, or use its Sell button), scroll to “Sell shares”, enter how many, and press Sell. It sells at the live price, the money returns to your cash, and your profit or loss is recorded in History.",
  },
  {
    keys: ["candle", "candlestick", "chart", "graph", "interval", "5m", "15m"],
    answer:
      "On any stock page you can switch the chart between intervals (5m, 15m, 30m, 1H, 1D, 1W) and between Line and Candles view. A green candle means the price rose during that interval, red means it fell; the thin wicks show the highest and lowest prices touched. The chart refreshes automatically — watch the LIVE badge.",
  },
  {
    keys: ["cash", "balance", "100,000", "100000", "100k", "virtual"],
    answer:
      "Your virtual cash is shown on the dashboard's Account Value card. Everyone starts with $100,000. Buying spends it, selling refills it, and Account Value = cash + the live value of your stocks. The goal of the game: grow it!",
  },
  {
    keys: ["forgot", "reset password", "can't login", "cannot login", "cant login", "invalid login"],
    answer:
      "If you forgot your password: on the Sign in page, type your email and click “Forgot password?” — you'll get a reset link by email. If it says “invalid login credentials”, double-check the email spelling and remember passwords are case-sensitive.",
  },
  {
    keys: ["password", "change password"],
    answer: "To change your password: click Account in the sidebar, enter a new password twice, and press Update password.",
  },
  {
    keys: ["sign up", "signup", "register", "create account", "new account"],
    answer:
      "Click Sign in in the sidebar, enter your email and a password (6+ characters), and press “Create account”. Your account starts working immediately with $100,000 of virtual cash.",
  },
  {
    keys: ["watchlist", "star", "follow"],
    answer:
      "The Watchlist lets you follow stocks without buying them. Click the ⭐ star next to any search result, or the Watch button on a stock's page. Your watchlist appears on the dashboard with live prices.",
  },
  {
    keys: ["market open", "market hours", "market closed", "when", "time", "hours"],
    answer:
      "US markets are open Monday–Friday, 9:30 AM–4:00 PM New York time (7:30 PM–2:00 AM Pakistan time). Outside those hours prices don't move, so charts and your portfolio hold still until the next session.",
  },
  {
    keys: ["profit", "loss", "realized", "p&l", "gain"],
    answer:
      "Two kinds of profit: unrealized (your stocks are worth more than you paid, but it changes with the market) and realized (locked in when you sell). The dashboard shows both, History lists profit per sale, and Analytics shows your win rate and best/worst trades.",
  },
  {
    keys: ["history", "transactions", "trades list"],
    answer: "Click History in the sidebar to see every buy and sell you've made, with date, price, total, and profit for each sale.",
  },
  {
    keys: ["analytics", "allocation", "win rate", "stats"],
    answer:
      "Click Analytics in the sidebar for your stats: realized profit, win rate, an allocation donut showing how your money is split between stocks and cash, and your best and worst trades.",
  },
  {
    keys: ["price", "live", "real time", "delay", "data"],
    answer:
      "Prices are live market data (from Finnhub and Yahoo Finance), refreshed about every 30–60 seconds. Some quotes can lag the exchange by up to a minute — the same freshness most free finance apps provide.",
  },
  {
    keys: ["fee", "commission", "cost", "charge"],
    answer: "There are no fees or commissions — buys and sells happen exactly at the live market price.",
  },
  {
    keys: ["hello", "hi", "hey", "salam", "assalam"],
    answer: "Hello! 👋 Ask me anything about Marketcap — for example “how do I buy a stock?” or “is the money real?”",
  },
  {
    keys: ["thank", "thanks", "shukriya"],
    answer: "You're welcome! Happy trading 📈",
  },
];

function botReply(input: string): string {
  const q = input.toLowerCase();
  for (const { keys, answer } of ANSWERS) {
    if (keys.some((k) => q.includes(k))) return answer;
  }
  return "I'm not sure about that one. Check the Guide page (book icon in the sidebar) for a full walkthrough — it covers finding stocks, buying, selling, and reading charts. Try asking me things like “how do I sell?” or “what is virtual cash?”";
}

export function HelpChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: GREETING }]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  function ask(text: string) {
    const q = text.trim();
    if (!q) return;
    setInput("");
    setMsgs((m) => [...m, { from: "user", text: q }]);
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: botReply(q) }]);
    }, 400);
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl">
          <div className="flex items-center gap-2.5 border-b border-line bg-accent px-4 py-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <MessageCircle className="h-4 w-4 text-white" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Marketcap Help</p>
              <p className="text-[11px] text-white/80">Instant answers, no waiting</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close help chat"
              className="rounded-md p-1 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-3">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.from === "bot"
                      ? "self-start rounded-bl-sm bg-background"
                      : "self-end rounded-br-sm bg-accent text-white"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {msgs.length === 1 && (
                <div className="flex flex-wrap gap-2">
                  {QUICK.map((q) => (
                    <button
                      key={q}
                      onClick={() => ask(q)}
                      className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-line p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              className="min-w-0 flex-1 rounded-full border border-line bg-background px-4 py-2 text-sm outline-none focus:border-accent"
            />
            <button
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-opacity hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close help" : "Open help chat"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-xl transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
