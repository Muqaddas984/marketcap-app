export type Stock = {
  ticker: string;
  name: string;
  value: number;
  changePct: number;
  investDate: string;
  volume: string;
  pricePerShare: number;
};

export const stocks: Stock[] = [
  {
    ticker: "AAPL",
    name: "Apple Inc",
    value: 15238,
    changePct: 5.9,
    investDate: "Feb 22, 2024",
    volume: "7.10B",
    pricePerShare: 193.3,
  },
  {
    ticker: "GOGL",
    name: "Google Corp",
    value: 6842,
    changePct: 5.9,
    investDate: "Jan 14, 2024",
    volume: "3.84B",
    pricePerShare: 141.8,
  },
  {
    ticker: "SPOT",
    name: "Spotify Technology SA",
    value: 12238,
    changePct: -5.9,
    investDate: "Mar 05, 2024",
    volume: "1.62B",
    pricePerShare: 254.1,
  },
  {
    ticker: "TWTR",
    name: "Twitter Inc",
    value: 5410,
    changePct: -2.9,
    investDate: "Feb 17, 2024",
    volume: "2.10B",
    pricePerShare: 23.3,
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp",
    value: 9120,
    changePct: 3.4,
    investDate: "Apr 02, 2024",
    volume: "5.44B",
    pricePerShare: 415.2,
  },
];

export const portfolio = {
  total: 17580,
  changePct: 5.9,
  profit: 4790,
};

export const chartData = [
  { date: "Dec 1", value: 34200 },
  { date: "Dec 2", value: 38400 },
  { date: "Dec 3", value: 36800 },
  { date: "Dec 4", value: 39600 },
  { date: "Dec 5", value: 37900 },
  { date: "Dec 6", value: 41200 },
  { date: "Dec 7", value: 25500 },
  { date: "Dec 8", value: 43800 },
];

export function money(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}
