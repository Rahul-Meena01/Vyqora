import { useState, useEffect, useRef, useMemo } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#09090C",
  surface: "#111118",
  surfaceHover: "#16161F",
  border: "#1E1E2C",
  borderStrong: "#2C2C3C",
  gold: "#F5C542",
  goldDim: "rgba(245,197,66,0.12)",
  goldBorder: "rgba(245,197,66,0.22)",
  green: "#10D98A",
  greenDim: "rgba(16,217,138,0.1)",
  red: "#F5426C",
  redDim: "rgba(245,66,108,0.1)",
  text: "#F0EBE3",
  muted: "#7A7A8E",
  faint: "#2A2A3A",
  font: "'Courier New', 'SF Mono', monospace",
  fontSans: "system-ui, -apple-system, sans-serif",
};

// ─── DATA SETUP ──────────────────────────────────────────────────────────────
const CATS = {
  salary: { label: "Salary", color: "#10D98A", icon: "▲", type: "income" },
  freelance: {
    label: "Freelance",
    color: "#34D399",
    icon: "◆",
    type: "income",
  },
  investment: {
    label: "Investment",
    color: "#6EE7B7",
    icon: "●",
    type: "income",
  },
  rent: { label: "Rent", color: "#F5426C", icon: "⌂", type: "expense" },
  food: {
    label: "Food & Dining",
    color: "#FB923C",
    icon: "◉",
    type: "expense",
  },
  transport: {
    label: "Transport",
    color: "#FBBF24",
    icon: "▶",
    type: "expense",
  },
  utilities: {
    label: "Utilities",
    color: "#A78BFA",
    icon: "⚡",
    type: "expense",
  },
  entertainment: {
    label: "Entertainment",
    color: "#F472B6",
    icon: "★",
    type: "expense",
  },
  shopping: { label: "Shopping", color: "#38BDF8", icon: "◈", type: "expense" },
  health: { label: "Health", color: "#86EFAC", icon: "+", type: "expense" },
  education: {
    label: "Education",
    color: "#FDE68A",
    icon: "◎",
    type: "expense",
  },
  other: { label: "Other", color: "#94A3B8", icon: "■", type: "expense" },
};

let _id = 1;
const mkId = () => `t${_id++}`;

const SAMPLE = [
  {
    id: mkId(),
    date: "2025-04-01",
    description: "Monthly Salary — TechCorp",
    amount: 85000,
    category: "salary",
    type: "income",
  },
  {
    id: mkId(),
    date: "2025-04-02",
    description: "Apartment Rent",
    amount: 18000,
    category: "rent",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-04-05",
    description: "DMart Groceries",
    amount: 3200,
    category: "food",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-04-08",
    description: "Zomato — Team Lunch",
    amount: 1050,
    category: "food",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-04-10",
    description: "Ola Rides — Weekly",
    amount: 1200,
    category: "transport",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-04-12",
    description: "Freelance Project — UI Kit",
    amount: 15000,
    category: "freelance",
    type: "income",
  },
  {
    id: mkId(),
    date: "2025-04-14",
    description: "Netflix + Spotify Bundle",
    amount: 749,
    category: "entertainment",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-04-15",
    description: "JVVNL Electricity Bill",
    amount: 1850,
    category: "utilities",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-04-18",
    description: "Myntra — Summer Wardrobe",
    amount: 3400,
    category: "shopping",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-04-22",
    description: "Udemy — React Advanced",
    amount: 499,
    category: "education",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-04-25",
    description: "HDFC Intraday Profit",
    amount: 4200,
    category: "investment",
    type: "income",
  },
  {
    id: mkId(),
    date: "2025-03-01",
    description: "Monthly Salary — TechCorp",
    amount: 85000,
    category: "salary",
    type: "income",
  },
  {
    id: mkId(),
    date: "2025-03-02",
    description: "Apartment Rent",
    amount: 18000,
    category: "rent",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-03-06",
    description: "BigBasket Groceries",
    amount: 2800,
    category: "food",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-03-10",
    description: "Petrol Fill-up — Hero",
    amount: 2200,
    category: "transport",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-03-12",
    description: "Freelance — Landing Page",
    amount: 12000,
    category: "freelance",
    type: "income",
  },
  {
    id: mkId(),
    date: "2025-03-15",
    description: "Jio + OTT Bundle",
    amount: 1199,
    category: "utilities",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-03-18",
    description: "Cult.fit Gym Membership",
    amount: 1500,
    category: "health",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-03-22",
    description: "Amazon — Tech Accessories",
    amount: 3200,
    category: "shopping",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-03-28",
    description: "Weekend Trip to Pushkar",
    amount: 4500,
    category: "entertainment",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-02-01",
    description: "Monthly Salary — TechCorp",
    amount: 85000,
    category: "salary",
    type: "income",
  },
  {
    id: mkId(),
    date: "2025-02-02",
    description: "Apartment Rent",
    amount: 18000,
    category: "rent",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-02-10",
    description: "Freelance — Dashboard UI",
    amount: 20000,
    category: "freelance",
    type: "income",
  },
  {
    id: mkId(),
    date: "2025-02-14",
    description: "Valentine's Gifts — Amazon",
    amount: 2800,
    category: "shopping",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-02-18",
    description: "Utility Bills Bundle",
    amount: 2100,
    category: "utilities",
    type: "expense",
  },
  {
    id: mkId(),
    date: "2025-02-25",
    description: "TCS Dividend Payout",
    amount: 8500,
    category: "investment",
    type: "income",
  },
  {
    id: mkId(),
    date: "2025-02-08",
    description: "Valentine's Dinner",
    amount: 3200,
    category: "food",
    type: "expense",
  },
];

// ─── UTILS ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-IN").format(Math.round(Math.abs(n)));
const fmtK = (v) => (v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`);
const monthLabel = (d) =>
  new Date(d).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
const dayLabel = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

// ─── ICONS ───────────────────────────────────────────────────────────────────
function Ico({
  d,
  size = 18,
  stroke = "currentColor",
  fill = "none",
  sw = 1.5,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}
const IC = {
  grid: "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  chart: "M3 20l5-8 4 5 4-10 5 13",
  bot: "M12 2a2 2 0 012 2v1h3a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h3V4a2 2 0 012-2zm0 5a1 1 0 100 2 1 1 0 000-2zm-3 5h6m-6 3h6",
  plus: "M12 5v14M5 12h14",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  trash: "M3 6h18m-2 0V20a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4h8v2",
  key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  x: "M18 6L6 18M6 6l12 12",
  spark: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11 3a3 3 0 100-6 3 3 0 000 6z",
  warn: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01",
};

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.borderStrong}`,
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 12,
      }}
    >
      <div style={{ color: T.muted, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 3 }}>
          {p.name}: ₹{fmt(p.value)}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function FinanceOS() {
  const defaultSetup = {
    name: "",
    monthlyIncome: "60000",
    rent: "15000",
    food: "7000",
    transport: "3000",
    utilities: "2500",
    lifestyle: "5000",
    savingsTargetRate: "25",
  };

  const [txns, setTxns] = useState(() => {
    try {
      const s = localStorage.getItem("fos_txns");
      return s ? JSON.parse(s) : SAMPLE;
    } catch {
      return SAMPLE;
    }
  });
  const [view, setView] = useState("dashboard");
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("fos_gemini_key") || "",
  );
  const [msgs, setMsgs] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI financial advisor powered by Google Gemini.\n\nAdd your Gemini API key once, then ask me about spending analysis, savings tips, budget breakdowns, or investment ideas.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [setupProfile, setSetupProfile] = useState(() => {
    try {
      const s = localStorage.getItem("fos_profile");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });
  const [showSetup, setShowSetup] = useState(() => {
    try {
      return !localStorage.getItem("fos_profile");
    } catch {
      return true;
    }
  });
  const [setupForm, setSetupForm] = useState(() => ({
    ...(defaultSetup || {}),
  }));
  const [showKey, setShowKey] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [quotaBlocked, setQuotaBlocked] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [newT, setNewT] = useState({
    date: new Date().toISOString().slice(0, 10),
    description: "",
    amount: "",
    category: "food",
    type: "expense",
  });
  const chatEnd = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("fos_txns", JSON.stringify(txns));
    } catch {}
  }, [txns]);
  useEffect(() => {
    if (!setupProfile) return;
    try {
      localStorage.setItem("fos_profile", JSON.stringify(setupProfile));
    } catch {}
  }, [setupProfile]);
  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);
  useEffect(() => {
    if (!setupProfile) return;
    setSetupForm({
      ...defaultSetup,
      ...Object.fromEntries(
        Object.entries(setupProfile).map(([k, v]) => [k, String(v ?? "")]),
      ),
    });
  }, [setupProfile]);

  // ── COMPUTED ──
  const stats = useMemo(() => {
    const now = new Date();
    const m = now.getMonth(),
      y = now.getFullYear();
    const thisMonth = txns.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === m && d.getFullYear() === y;
    });
    const income = thisMonth
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expenses = thisMonth
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const allInc = txns
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const allExp = txns
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return {
      income,
      expenses,
      balance: allInc - allExp,
      savingsRate:
        income > 0 ? Math.round(((income - expenses) / income) * 100) : 0,
    };
  }, [txns]);

  const monthlyData = useMemo(() => {
    const m = {};
    txns.forEach((t) => {
      const k = t.date.slice(0, 7);
      if (!m[k])
        m[k] = { month: monthLabel(`${k}-01`), income: 0, expenses: 0 };
      t.type === "income"
        ? (m[k].income += t.amount)
        : (m[k].expenses += t.amount);
    });
    return Object.entries(m)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, v]) => v);
  }, [txns]);

  const catData = useMemo(() => {
    const c = {};
    txns
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        c[t.category] = (c[t.category] || 0) + t.amount;
      });
    return Object.entries(c)
      .map(([k, v]) => ({
        name: CATS[k]?.label || k,
        value: v,
        color: CATS[k]?.color || "#888",
        key: k,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [txns]);

  const filteredTxns = useMemo(
    () =>
      txns.filter((t) => {
        const ms = t.description.toLowerCase().includes(search.toLowerCase());
        const mf = filter === "all" || t.type === filter;
        return ms && mf;
      }),
    [txns, search, filter],
  );

  const monthDelta = useMemo(() => {
    const now = new Date();
    const thisKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

    const sumBy = (key, type) =>
      txns
        .filter(
          (t) => t.date.startsWith(key) && (type ? t.type === type : true),
        )
        .reduce((s, t) => s + t.amount, 0);

    const tIncome = sumBy(thisKey, "income");
    const tExpenses = sumBy(thisKey, "expense");
    const pIncome = sumBy(prevKey, "income");
    const pExpenses = sumBy(prevKey, "expense");

    const pct = (curr, prev) => {
      if (!prev) return curr ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    return {
      incomePct: pct(tIncome, pIncome),
      expensePct: pct(tExpenses, pExpenses),
      balancePct: pct(tIncome - tExpenses, pIncome - pExpenses),
    };
  }, [txns]);

  const metricCards = useMemo(() => {
    const targetRate = Number(setupProfile?.savingsTargetRate || 25);
    return [
      {
        label: "Net Balance",
        val: `₹${fmt(stats.balance)}`,
        tag: `${monthDelta.balancePct >= 0 ? "+" : ""}${monthDelta.balancePct}% vs last month`,
        up: monthDelta.balancePct >= 0,
      },
      {
        label: "Month Income",
        val: `₹${fmt(stats.income)}`,
        tag: `${monthDelta.incomePct >= 0 ? "+" : ""}${monthDelta.incomePct}% vs last month`,
        up: monthDelta.incomePct >= 0,
      },
      {
        label: "Month Expenses",
        val: `₹${fmt(stats.expenses)}`,
        tag: `${monthDelta.expensePct >= 0 ? "+" : ""}${monthDelta.expensePct}% vs last month`,
        up: monthDelta.expensePct <= 0,
      },
      {
        label: "Savings Rate",
        val: `${stats.savingsRate}%`,
        tag:
          stats.savingsRate >= targetRate
            ? `Above target (${targetRate}%)`
            : `Below target (${targetRate}%)`,
        up: stats.savingsRate >= targetRate,
      },
    ];
  }, [stats, monthDelta, setupProfile]);

  // ── ACTIONS ──
  const addTxn = () => {
    if (!newT.description.trim() || !newT.amount) return;
    setTxns((p) => [
      { ...newT, id: mkId(), amount: parseFloat(newT.amount) },
      ...p,
    ]);
    setNewT({
      date: new Date().toISOString().slice(0, 10),
      description: "",
      amount: "",
      category: "food",
      type: "expense",
    });
    setShowAdd(false);
  };
  const delTxn = (id) => setTxns((p) => p.filter((t) => t.id !== id));

  const applySetup = () => {
    const income = Number(setupForm.monthlyIncome || 0);
    const rent = Number(setupForm.rent || 0);
    const food = Number(setupForm.food || 0);
    const transport = Number(setupForm.transport || 0);
    const utilities = Number(setupForm.utilities || 0);
    const lifestyle = Number(setupForm.lifestyle || 0);
    const targetRate = Number(setupForm.savingsTargetRate || 25);

    if (income <= 0) return;

    const today = new Date();
    const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const mkDate = (day) => `${ym}-${String(day).padStart(2, "0")}`;

    const seeded = [
      {
        id: mkId(),
        date: mkDate(1),
        description: setupForm.name
          ? `Salary Credit — ${setupForm.name}`
          : "Salary Credit",
        amount: income,
        category: "salary",
        type: "income",
      },
      {
        id: mkId(),
        date: mkDate(3),
        description: "Monthly Rent",
        amount: rent,
        category: "rent",
        type: "expense",
      },
      {
        id: mkId(),
        date: mkDate(6),
        description: "Food & Groceries",
        amount: food,
        category: "food",
        type: "expense",
      },
      {
        id: mkId(),
        date: mkDate(10),
        description: "Transport Spend",
        amount: transport,
        category: "transport",
        type: "expense",
      },
      {
        id: mkId(),
        date: mkDate(13),
        description: "Utility Bills",
        amount: utilities,
        category: "utilities",
        type: "expense",
      },
      {
        id: mkId(),
        date: mkDate(17),
        description: "Lifestyle & Wants",
        amount: lifestyle,
        category: "shopping",
        type: "expense",
      },
    ].filter((t) => t.amount > 0);

    setTxns(seeded);
    setSetupProfile({
      name: setupForm.name.trim(),
      monthlyIncome: income,
      rent,
      food,
      transport,
      utilities,
      lifestyle,
      savingsTargetRate: Math.max(1, Math.min(90, targetRate)),
    });
    setShowSetup(false);
    setView("dashboard");
  };

  const saveKey = () => {
    localStorage.setItem("fos_gemini_key", keyInput.trim());
    setApiKey(keyInput.trim());
    setQuotaBlocked(false);
    setShowKey(false);
    setKeyInput("");
  };

  const clearKey = () => {
    localStorage.removeItem("fos_gemini_key");
    setApiKey("");
    setQuotaBlocked(false);
    setShowKey(false);
  };

  const financialContext = () => {
    const recent = txns
      .slice(0, 20)
      .map(
        (t) =>
          `${t.date} | ${t.type === "income" ? "+" : "-"}₹${fmt(t.amount)} | ${CATS[t.category]?.label} | ${t.description}`,
      )
      .join("\n");
    return `FINANCIAL SNAPSHOT:\nBalance: ₹${fmt(stats.balance)} | This month income: ₹${fmt(stats.income)} | This month expenses: ₹${fmt(stats.expenses)} | Savings rate: ${stats.savingsRate}%\n\nRECENT TRANSACTIONS:\n${recent}`;
  };

  const parseMoneyTarget = (text) => {
    const m = text.match(
      /(?:₹\s*)?([0-9][0-9,]*(?:\.\d+)?)\s*(lakh|lac|k|thousand)?/i,
    );
    if (!m) return null;
    const base = Number(m[1].replace(/,/g, ""));
    const unit = (m[2] || "").toLowerCase();
    if (!Number.isFinite(base)) return null;
    if (unit === "lakh" || unit === "lac") return base * 100000;
    if (unit === "k" || unit === "thousand") return base * 1000;
    return base;
  };

  const getMonthsToYearEnd = () => {
    const now = new Date();
    return Math.max(1, 11 - now.getMonth());
  };

  const buildLocalAdvice = (question) => {
    const q = question.toLowerCase();
    const hasAny = (words) => words.some((w) => q.includes(w));
    const monthKeys = [...new Set(txns.map((t) => t.date.slice(0, 7)))].sort();
    const latestKey = monthKeys[monthKeys.length - 1];
    const prevKey = monthKeys[monthKeys.length - 2];

    const summarizeMonth = (key) => {
      const rows = txns.filter((t) => t.date.startsWith(key));
      const income = rows
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);
      const expenses = rows
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
      const byCat = {};
      rows
        .filter((t) => t.type === "expense")
        .forEach((t) => {
          byCat[t.category] = (byCat[t.category] || 0) + t.amount;
        });
      return { income, expenses, savings: income - expenses, byCat, rows };
    };

    const latest = latestKey
      ? summarizeMonth(latestKey)
      : { income: 0, expenses: 0, savings: 0, byCat: {}, rows: [] };
    const prev = prevKey
      ? summarizeMonth(prevKey)
      : { income: 0, expenses: 0, savings: 0, byCat: {}, rows: [] };

    const latestRate =
      latest.income > 0
        ? Math.round((latest.savings / latest.income) * 100)
        : 0;
    const totalExpense = Math.max(latest.expenses, 0);
    const topCats = Object.entries(latest.byCat)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    const topCategory = topCats[0];

    const foodSpend = latest.byCat.food || 0;
    const foodPct =
      totalExpense > 0 ? Math.round((foodSpend / totalExpense) * 100) : 0;
    const foodOrders = latest.rows.filter(
      (t) => t.type === "expense" && t.category === "food",
    ).length;

    const shoppingSpend = latest.byCat.shopping || 0;
    const wantsSpend =
      (latest.byCat.shopping || 0) + (latest.byCat.entertainment || 0);
    const essentials =
      (latest.byCat.rent || 0) +
      (latest.byCat.utilities || 0) +
      (latest.byCat.food || 0) +
      (latest.byCat.transport || 0);

    const catDiff = {};
    new Set([...Object.keys(latest.byCat), ...Object.keys(prev.byCat)]).forEach(
      (k) => {
        catDiff[k] = (latest.byCat[k] || 0) - (prev.byCat[k] || 0);
      },
    );
    const increasedCat = Object.entries(catDiff).sort((a, b) => b[1] - a[1])[0];
    const decreasedCat = Object.entries(catDiff).sort((a, b) => a[1] - b[1])[0];

    const monthSummaries = monthKeys.map((k) => ({
      key: k,
      ...summarizeMonth(k),
    }));
    const bestMonth = monthSummaries
      .map((m) => ({
        key: m.key,
        rate: m.income > 0 ? (m.savings / m.income) * 100 : -999,
      }))
      .sort((a, b) => b.rate - a.rate)[0];

    const risingExpenseMonths = monthSummaries
      .slice(-6)
      .reduce((acc, m, i, arr) => {
        if (i === 0) return 0;
        return arr[i].expenses > arr[i - 1].expenses ? acc + 1 : acc;
      }, 0);

    const targetAmount = parseMoneyTarget(question);
    const hasGoalTime = hasAny([
      "year",
      "december",
      "by december",
      "this year",
    ]);
    const goalMonths = hasGoalTime ? getMonthsToYearEnd() : 12;
    const neededPerMonth = targetAmount
      ? Math.ceil(targetAmount / goalMonths)
      : 0;

    if (hasAny(["student", "college", "pocket", "internship", "canteen"])) {
      return [
        "Student rule: save first, spend later.",
        "Use 50/30/20 on your stipend or pocket money: 50% needs, 30% wants, 20% savings.",
        "Cap canteen + delivery to a fixed weekly amount and move that cap to UPI wallet every Monday.",
      ].join("\n");
    }

    if (hasAny(["roast", "brutal", "be honest", "mistake", "disciplined"])) {
      const topLabel = topCategory
        ? CATS[topCategory[0]]?.label || topCategory[0]
        : "misc";
      return [
        "Brutal truth: your money is leaking through habits, not big emergencies.",
        `Biggest leak right now is ${topLabel} (₹${fmt(topCategory?.[1] || 0)} in latest month).`,
        "Smart saver move: pick 1 habit to kill for 30 days and auto-transfer the saved amount the same day.",
      ].join("\n");
    }

    if (hasAny(["debt", "emi", "loan", "prepay", "personal loan"])) {
      const emiShare =
        latest.income > 0
          ? Math.round(((latest.byCat.other || 0) / latest.income) * 100)
          : 0;
      return [
        "Debt safety rule: keep total EMI under 25-30% of monthly income.",
        `Your tracked data does not clearly separate EMI, so mark loan payments under a dedicated category for accuracy (estimated current burden from 'Other': ${emiShare}%).`,
        "Repay strategy: clear highest-interest debt first, keep minimum on others, avoid new EMI till savings rate is stable above 20%.",
      ].join("\n");
    }

    if (
      hasAny(["food", "swiggy", "zomato", "restaurant", "dining", "meal prep"])
    ) {
      const rangeHint =
        foodPct > 25
          ? "This is slightly above the ideal 20-25% range."
          : "This is within the ideal 20-25% range.";
      return [
        `You've spent ₹${fmt(foodSpend)} on food in your latest tracked month (${foodPct}% of expenses).`,
        rangeHint,
        `You placed about ${foodOrders} food transactions. Reducing 1-2 delivery orders weekly could save ₹2,000-₹3,500/month.`,
      ].join("\n");
    }

    if (
      hasAny([
        "shopping",
        "impulse",
        "gadget",
        "buy this",
        "online shopping",
        "wants",
      ])
    ) {
      const shoppingPct =
        totalExpense > 0 ? Math.round((shoppingSpend / totalExpense) * 100) : 0;
      return [
        `Shopping spend in latest month is ₹${fmt(shoppingSpend)} (${shoppingPct}% of expenses).`,
        "Impulse-control rule: wait 48 hours before non-essential purchases over ₹1,500.",
        `Set a monthly wants cap at ₹${fmt(Math.round((latest.income || 0) * 0.15))} and use only that for shopping + entertainment (currently ₹${fmt(wantsSpend)}).`,
      ].join("\n");
    }

    if (
      hasAny([
        "budget",
        "weekly",
        "safe spending",
        "can i spend",
        "allocate",
        "left this month",
      ])
    ) {
      const weeklyBudget = Math.max(
        0,
        Math.round(
          (latest.income - essentials - Math.max(latest.savings, 0)) / 4,
        ),
      );
      const discretionaryLeft = Math.max(
        0,
        latest.income - essentials - Math.max(latest.savings, 0),
      );
      return [
        `Safe discretionary budget in latest month is about ₹${fmt(discretionaryLeft)} (~₹${fmt(weeklyBudget)}/week).`,
        `Suggested split: Needs 55%, Wants 20%, Savings 25% on income ₹${fmt(latest.income)}.`,
        "Before any new spend, use this check: if it pushes wants above cap, delay by 7 days.",
      ].join("\n");
    }

    if (hasAny(["invest", "sip", "fd", "wealth", "start investing"])) {
      const investable = Math.max(0, Math.round(latest.income * 0.2));
      return [
        "Start investing after building 3-6 months emergency fund.",
        `Begin with ₹${fmt(Math.min(investable, 5000))}-₹${fmt(investable)} monthly if cash flow allows.`,
        "Starter split: 60% index SIP, 25% debt/FD, 10% gold, 5% cash buffer.",
      ].join("\n");
    }

    if (
      hasAny([
        "goal",
        "trip",
        "laptop",
        "bike",
        "wedding",
        "target",
        "1 lakh",
        "50,000",
        "save for",
      ])
    ) {
      if (!targetAmount) {
        return [
          "Share a target amount and deadline to get an exact monthly plan.",
          "Example: 'Can I save ₹1 lakh by December?'",
          "I will break it into monthly target + what to cut first.",
        ].join("\n");
      }
      const possible = latest.savings >= neededPerMonth;
      return [
        `Target: ₹${fmt(targetAmount)} in ${goalMonths} months needs about ₹${fmt(neededPerMonth)}/month.`,
        `Your latest monthly savings are ₹${fmt(Math.max(latest.savings, 0))}, so this goal is ${possible ? "on track" : "currently short"}.`,
        `Cut top discretionary categories by ₹${fmt(Math.max(0, neededPerMonth - Math.max(latest.savings, 0)))} monthly to close the gap.`,
      ].join("\n");
    }

    if (
      hasAny([
        "risk",
        "warning",
        "stressed",
        "paycheck",
        "emergency fund",
        "biggest risk",
      ])
    ) {
      const emergencyTarget = Math.round(essentials * 6);
      return [
        `Primary risk check: savings rate is ${latestRate}% and essentials are about ₹${fmt(essentials)} per month.`,
        `Emergency fund target: ₹${fmt(emergencyTarget)} (6 months essentials).`,
        "Fix first: lock a monthly auto-save, then reduce the top variable expense category by 10-15%.",
      ].join("\n");
    }

    if (
      hasAny([
        "income",
        "salary",
        "lifestyle",
        "irregular income",
        "split my salary",
      ])
    ) {
      return [
        `Income-health check (latest month): income ₹${fmt(latest.income)}, expenses ₹${fmt(latest.expenses)}, savings rate ${latestRate}%.`,
        `Suggested salary split: ₹${fmt(Math.round(latest.income * 0.55))} needs, ₹${fmt(Math.round(latest.income * 0.2))} wants, ₹${fmt(Math.round(latest.income * 0.25))} savings/investing.`,
        "After salary credit: auto-transfer savings first, then run the month from the remaining account.",
      ].join("\n");
    }

    if (
      hasAny([
        "last month",
        "improve",
        "trend",
        "progress",
        "increased",
        "decreased",
        "best month",
      ])
    ) {
      const expenseDelta = latest.expenses - prev.expenses;
      return [
        `Latest vs previous month: expenses ${expenseDelta >= 0 ? "up" : "down"} by ₹${fmt(Math.abs(expenseDelta))}.`,
        `Largest increase: ${CATS[increasedCat?.[0]]?.label || increasedCat?.[0] || "N/A"} (${increasedCat?.[1] > 0 ? `+₹${fmt(increasedCat[1])}` : "no major rise"}). Largest decrease: ${CATS[decreasedCat?.[0]]?.label || decreasedCat?.[0] || "N/A"} (${decreasedCat?.[1] < 0 ? `₹${fmt(decreasedCat[1])}` : "no major drop"}).`,
        `In the last 6 tracked months, expenses rose ${risingExpenseMonths} times. Best month by savings rate: ${bestMonth?.key || "N/A"}.`,
      ].join("\n");
    }

    if (
      hasAny([
        "overspending",
        "expenses high",
        "draining",
        "top spending",
        "unnecessary",
        "spend more",
      ])
    ) {
      return [
        `Top spending categories in latest month: ${topCats.map(([k, v]) => `${CATS[k]?.label || k} ₹${fmt(v)}`).join(", ") || "No data"}.`,
        `You spent ₹${fmt(latest.expenses)} against income ₹${fmt(latest.income)}; savings rate is ${latestRate}%.`,
        "Cut the highest variable category by 10% this month for the fastest improvement.",
      ].join("\n");
    }

    if (hasAny(["save", "saving", "savings"])) {
      const targetRate = 25;
      const targetSurplus = Math.round((latest.income * targetRate) / 100);
      const gap = Math.max(targetSurplus - Math.max(latest.savings, 0), 0);
      return [
        `You saved ₹${fmt(Math.max(latest.savings, 0))} in your latest tracked month (rate: ${latestRate}%).`,
        `Healthy target: ${targetRate}% (₹${fmt(targetSurplus)}). Gap to close: ₹${fmt(gap)}.`,
        "Save-more plan: automate savings on salary day and reduce top 2 optional categories by 12-15%.",
      ].join("\n");
    }

    return [
      `Latest snapshot: income ₹${fmt(latest.income)}, expenses ₹${fmt(latest.expenses)}, savings ₹${fmt(Math.max(latest.savings, 0))} (${latestRate}% rate).`,
      topCategory
        ? `Top expense category: ${CATS[topCategory[0]]?.label || topCategory[0]} (₹${fmt(topCategory[1])}).`
        : "Not enough expense data yet to detect a top category.",
      "Ask naturally: savings, overspending, food, shopping, budget, EMI/loan, goals, investing, trend, risk, or student finance.",
    ].join("\n");
  };

  const buildBusyLocalResponse = (question) => {
    return [
      "AI Advisor is temporarily busy.",
      "Showing smart local recommendations.",
      "",
      buildLocalAdvice(question),
    ].join("\n");
  };

  const sendMsg = async () => {
    if (!chatInput.trim() || streaming) return;
    const question = chatInput.trim();
    if (!apiKey) {
      setShowKey(true);
      return;
    }
    const userMsg = { role: "user", content: question };
    const history = [...msgs, userMsg];
    setMsgs([...history, { role: "assistant", content: "" }]);
    setChatInput("");
    setStreaming(true);

    // When quota is exhausted, avoid repeated failing API calls and serve local advice.
    if (quotaBlocked) {
      const localReply = buildBusyLocalResponse(question);
      setMsgs((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: localReply,
        };
        return updated;
      });
      setStreaming(false);
      return;
    }

    try {
      const modelCandidates = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro-latest",
      ];

      const requestBody = {
        systemInstruction: {
          parts: [
            {
              text: `You are a sharp, practical personal finance advisor for an Indian developer based in Jaipur. Give concise and actionable advice. Use ₹ for money. Avoid fluff.\n\n${financialContext()}`,
            },
          ],
        },
        contents: history.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 700,
        },
      };

      let reply = "";
      let lastErr = "Gemini request failed";

      for (const model of modelCandidates) {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const res = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        const data = await res.json();
        const modelReply = data?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || "")
          .join("")
          .trim();

        if (res.ok && modelReply) {
          reply = modelReply;
          break;
        }

        lastErr = data?.error?.message || "Gemini request failed";
        const notSupported =
          lastErr.toLowerCase().includes("not found") ||
          lastErr.toLowerCase().includes("not supported");

        if (!notSupported) {
          throw new Error(lastErr);
        }
      }

      if (!reply) {
        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`;
        const listRes = await fetch(listUrl);
        const listData = await listRes.json();
        const available = (listData?.models || [])
          .filter((m) =>
            (m.supportedGenerationMethods || []).includes("generateContent"),
          )
          .map((m) => m.name?.replace("models/", ""))
          .slice(0, 8)
          .join(", ");
        throw new Error(
          `${lastErr}${available ? ` | Available models: ${available}` : ""}`,
        );
      }

      const finalReply = reply || buildLocalAdvice(question);
      setMsgs((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: finalReply,
        };
        return updated;
      });
    } catch (e) {
      const msg = (e?.message || "").toLowerCase();
      const isQuotaError =
        msg.includes("quota") ||
        msg.includes("rate limit") ||
        msg.includes("exceeded your current quota") ||
        msg.includes("resource_exhausted");

      if (isQuotaError) {
        setQuotaBlocked(true);
      }

      setMsgs((prev) => {
        const u = [...prev];
        u[u.length - 1] = {
          ...u[u.length - 1],
          content: `${isQuotaError ? buildBusyLocalResponse(question) : `⚠ Gemini error: ${e.message}\n\nFallback advice:\n${buildLocalAdvice(question)}`}`,
        };
        return u;
      });
    }
    setStreaming(false);
  };

  // ── STYLES ──
  const css = {
    root: {
      position: "relative",
      display: "flex",
      height: "100vh",
      background: T.bg,
      color: T.text,
      fontFamily: T.fontSans,
      overflow: "hidden",
    },

    // Sidebar
    sidebar: {
      width: 228,
      background: T.surface,
      borderRight: `1px solid ${T.border}`,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    },
    logo: {
      padding: "22px 20px 18px",
      borderBottom: `1px solid ${T.border}`,
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    logoMark: {
      width: 32,
      height: 32,
      background:
        "linear-gradient(135deg, #F5C542 0%, #F59E0B 55%, #EAB308 100%)",
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: T.fontSans,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: "0.04em",
      color: T.bg,
      flexShrink: 0,
      boxShadow:
        "0 0 0 1px rgba(245,197,66,0.25), 0 8px 18px rgba(245,197,66,0.22)",
    },
    logoText: {
      fontSize: 15,
      fontWeight: 600,
      color: T.text,
      letterSpacing: "-0.01em",
    },
    logoSub: {
      fontSize: 10,
      color: T.muted,
      marginTop: 1,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    nav: { flex: 1, padding: "12px 8px" },
    navItem: (a) => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      borderRadius: 8,
      cursor: "pointer",
      marginBottom: 2,
      color: a ? T.gold : T.muted,
      background: a ? T.goldDim : "transparent",
      borderLeft: a ? `2px solid ${T.gold}` : "2px solid transparent",
      fontSize: 14,
      fontWeight: a ? 500 : 400,
      transition: "all 0.15s",
      userSelect: "none",
    }),
    sidebarBottom: { padding: "8px", borderTop: `1px solid ${T.border}` },
    keyBtn: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      borderRadius: 8,
      cursor: "pointer",
      color: apiKey ? T.green : T.muted,
      fontSize: 13,
      userSelect: "none",
    },

    // Main
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      minWidth: 0,
    },
    topbar: {
      padding: "18px 28px",
      borderBottom: `1px solid ${T.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
      background: T.bg,
    },
    viewTitle: {
      fontSize: 20,
      fontWeight: 600,
      color: T.text,
      letterSpacing: "-0.02em",
    },
    viewSub: { fontSize: 12, color: T.muted, marginTop: 3 },
    content: { flex: 1, overflowY: "auto", padding: "24px 28px" },

    // Cards
    grid4: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 12,
      marginBottom: 18,
    },
    grid21: {
      display: "grid",
      gridTemplateColumns: "1.6fr 1fr",
      gap: 12,
      marginBottom: 18,
    },
    card: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: "18px 20px",
    },
    cardTitle: {
      fontSize: 11,
      fontWeight: 600,
      color: T.muted,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: 14,
    },

    // Metric cards
    metric: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: "18px 20px",
    },
    mLabel: {
      fontSize: 11,
      color: T.muted,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      marginBottom: 8,
    },
    mVal: {
      fontSize: 26,
      fontWeight: 700,
      color: T.text,
      letterSpacing: "-0.03em",
      fontFamily: T.font,
      fontVariantNumeric: "tabular-nums",
    },
    mTag: (up) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      marginTop: 7,
      fontSize: 11,
      fontWeight: 600,
      color: up ? T.green : T.red,
      background: up ? T.greenDim : T.redDim,
      padding: "3px 8px",
      borderRadius: 6,
    }),

    // Transactions
    txnWrap: {
      padding: "8px 12px",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      gap: 12,
      transition: "background 0.1s",
      cursor: "default",
    },
    txnDot: (cat) => ({
      width: 34,
      height: 34,
      borderRadius: 9,
      background: `${CATS[cat]?.color || "#888"}18`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      flexShrink: 0,
      border: `1px solid ${CATS[cat]?.color || "#888"}30`,
    }),
    txnDesc: { fontSize: 14, color: T.text, lineHeight: 1 },
    txnMeta: { fontSize: 11, color: T.muted, marginTop: 4 },
    txnAmt: (type) => ({
      fontSize: 14,
      fontWeight: 700,
      color: type === "income" ? T.green : T.red,
      fontFamily: T.font,
      fontVariantNumeric: "tabular-nums",
      flexShrink: 0,
    }),

    // Inputs
    input: {
      background: T.faint,
      border: `1px solid ${T.borderStrong}`,
      borderRadius: 8,
      padding: "9px 12px",
      color: T.text,
      fontSize: 14,
      fontFamily: T.fontSans,
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
    },
    select: {
      background: T.faint,
      border: `1px solid ${T.borderStrong}`,
      borderRadius: 8,
      padding: "9px 12px",
      color: T.text,
      fontSize: 14,
      fontFamily: T.fontSans,
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
    },
    btnPrimary: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      padding: "9px 18px",
      borderRadius: 8,
      border: "none",
      background: T.gold,
      color: T.bg,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: T.fontSans,
      letterSpacing: "0.01em",
    },
    btnGhost: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 14px",
      borderRadius: 8,
      border: `1px solid ${active ? T.gold : T.borderStrong}`,
      background: active ? T.goldDim : "transparent",
      color: active ? T.gold : T.muted,
      fontSize: 12,
      fontWeight: active ? 600 : 400,
      cursor: "pointer",
      fontFamily: T.fontSans,
    }),
    btnDanger: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "8px 14px",
      borderRadius: 8,
      border: `1px solid ${T.red}44`,
      background: T.redDim,
      color: T.red,
      fontSize: 12,
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: T.fontSans,
    },
    iconBtn: {
      background: "none",
      border: "none",
      color: T.faint,
      cursor: "pointer",
      padding: "5px",
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      transition: "color 0.15s",
    },

    // Chat
    chatWrap: {
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 130px)",
    },
    chatLog: { flex: 1, overflowY: "auto", paddingBottom: 12 },
    bubble: (r) => ({
      display: "flex",
      gap: 10,
      marginBottom: 14,
      flexDirection: r === "user" ? "row-reverse" : "row",
      alignItems: "flex-start",
    }),
    avatar: (r) => ({
      width: 30,
      height: 30,
      borderRadius: "50%",
      background: r === "user" ? T.faint : T.goldDim,
      border: `1px solid ${r === "user" ? T.borderStrong : T.goldBorder}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      fontSize: 13,
      color: r === "user" ? T.muted : T.gold,
    }),
    bubbleText: (r) => ({
      maxWidth: "72%",
      padding: "11px 14px",
      borderRadius: r === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
      background: r === "user" ? T.faint : "rgba(245,197,66,0.06)",
      border: `1px solid ${r === "user" ? T.borderStrong : T.goldBorder}`,
      fontSize: 14,
      color: T.text,
      lineHeight: 1.65,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }),
    chatBottom: {
      flexShrink: 0,
      borderTop: `1px solid ${T.border}`,
      paddingTop: 14,
    },
    quickRow: { display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 },
    quick: {
      fontSize: 11,
      padding: "5px 11px",
      borderRadius: 20,
      border: `1px solid ${T.borderStrong}`,
      background: "transparent",
      color: T.muted,
      cursor: "pointer",
      fontFamily: T.fontSans,
    },
    chatRow: { display: "flex", gap: 8 },

    // Modal
    overlay: {
      position: "absolute",
      inset: 0,
      background: "rgba(5,5,8,0.82)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      padding: 20,
    },
    modal: {
      background: T.surface,
      border: `1px solid ${T.borderStrong}`,
      borderRadius: 16,
      padding: "26px 28px",
      width: "100%",
      maxWidth: 420,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: 600,
      color: T.text,
      marginBottom: 18,
    },
    formRow: { marginBottom: 12 },
    formLabel: {
      fontSize: 11,
      color: T.muted,
      display: "block",
      marginBottom: 5,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
    },
    typeToggle: { display: "flex", gap: 8, marginBottom: 16 },
  };

  const views = [
    { id: "dashboard", label: "Dashboard", icon: IC.grid },
    { id: "transactions", label: "Transactions", icon: IC.list },
    { id: "analytics", label: "Analytics", icon: IC.chart },
    { id: "ai", label: "AI Advisor", icon: IC.bot },
  ];

  const totalCatExp = catData.reduce((s, c) => s + c.value, 0);

  return (
    <div style={css.root}>
      {/* ── SIDEBAR ── */}
      <aside style={css.sidebar}>
        <div style={css.logo}>
          <div style={css.logoMark}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-label="Vyqora logo"
            >
              <path
                d="M2.8 4.2L7.1 13.5C7.5 14.4 8.8 14.4 9.2 13.5L13.5 4.2"
                stroke="#09090C"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.1 11.7C13.1 13.9 14.7 15.5 16.8 15.5C17.1 15.5 17.3 15.5 17.5 15.4V17.3"
                stroke="#09090C"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="16.8"
                cy="11.7"
                r="3.1"
                stroke="#09090C"
                strokeWidth="2.1"
              />
            </svg>
          </div>
          <div>
            <div style={css.logoText}>Vyqora</div>
            <div style={css.logoSub}>Money Control Hub</div>
          </div>
        </div>
        <nav style={css.nav}>
          {views.map((v) => (
            <div
              key={v.id}
              style={css.navItem(view === v.id)}
              onClick={() => setView(v.id)}
            >
              <Ico d={v.icon} size={15} stroke="currentColor" />
              {v.label}
            </div>
          ))}
        </nav>
        <div style={css.sidebarBottom}>
          <div style={css.keyBtn} onClick={() => setShowKey(true)}>
            <Ico d={IC.key} size={15} stroke="currentColor" />
            <span style={{ fontSize: 13 }}>
              Gemini API Key {apiKey ? "✓" : ""}
            </span>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={css.main}>
        {/* Topbar */}
        <div style={css.topbar}>
          <div>
            <div style={css.viewTitle}>
              {
                {
                  dashboard: "Overview",
                  transactions: "Transactions",
                  analytics: "Analytics",
                  ai: "AI Financial Advisor",
                }[view]
              }
            </div>
            <div style={css.viewSub}>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={css.btnGhost(false)}
              onClick={() => setShowSetup(true)}
            >
              <Ico d={IC.eye} size={14} stroke="currentColor" />
              {setupProfile ? "Edit Setup" : "Getting Started"}
            </button>
            {view !== "ai" && (
              <button style={css.btnPrimary} onClick={() => setShowAdd(true)}>
                <Ico d={IC.plus} size={14} stroke={T.bg} />
                Add Transaction
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={css.content}>
          {/* ─── DASHBOARD ─── */}
          {view === "dashboard" && (
            <>
              <div style={css.grid4}>
                {metricCards.map((m, i) => (
                  <div key={i} style={css.metric}>
                    <div style={css.mLabel}>{m.label}</div>
                    <div style={css.mVal}>{m.val}</div>
                    <div style={css.mTag(m.up)}>
                      {m.up ? "↑" : "↓"} {m.tag}
                    </div>
                  </div>
                ))}
              </div>

              {setupProfile && (
                <div style={{ ...css.card, marginBottom: 14 }}>
                  <div style={css.cardTitle}>Your Setup Plan</div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4,1fr)",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        background: T.faint,
                        borderRadius: 10,
                        padding: "10px 12px",
                      }}
                    >
                      <div style={{ fontSize: 11, color: T.muted }}>
                        Monthly Income
                      </div>
                      <div style={{ fontFamily: T.font, fontSize: 16 }}>
                        ₹{fmt(setupProfile.monthlyIncome || 0)}
                      </div>
                    </div>
                    <div
                      style={{
                        background: T.faint,
                        borderRadius: 10,
                        padding: "10px 12px",
                      }}
                    >
                      <div style={{ fontSize: 11, color: T.muted }}>
                        Fixed Costs
                      </div>
                      <div style={{ fontFamily: T.font, fontSize: 16 }}>
                        ₹
                        {fmt(
                          (setupProfile.rent || 0) +
                            (setupProfile.utilities || 0) +
                            (setupProfile.transport || 0),
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        background: T.faint,
                        borderRadius: 10,
                        padding: "10px 12px",
                      }}
                    >
                      <div style={{ fontSize: 11, color: T.muted }}>
                        Food Budget
                      </div>
                      <div style={{ fontFamily: T.font, fontSize: 16 }}>
                        ₹{fmt(setupProfile.food || 0)}
                      </div>
                    </div>
                    <div
                      style={{
                        background: T.faint,
                        borderRadius: 10,
                        padding: "10px 12px",
                      }}
                    >
                      <div style={{ fontSize: 11, color: T.muted }}>
                        Savings Target
                      </div>
                      <div style={{ fontFamily: T.font, fontSize: 16 }}>
                        {setupProfile.savingsTargetRate || 25}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={css.grid21}>
                <div style={css.card}>
                  <div style={css.cardTitle}>
                    Income vs Expenses — Last 6 Months
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={monthlyData}
                      barSize={14}
                      barCategoryGap="30%"
                    >
                      <CartesianGrid
                        strokeDasharray="2 4"
                        stroke={T.border}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{
                          fill: T.muted,
                          fontSize: 11,
                          fontFamily: T.fontSans,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{
                          fill: T.muted,
                          fontSize: 11,
                          fontFamily: T.fontSans,
                        }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={fmtK}
                        width={48}
                      />
                      <Tooltip content={<ChartTip />} />
                      <Bar
                        dataKey="income"
                        fill={T.green}
                        name="Income"
                        radius={[3, 3, 0, 0]}
                      />
                      <Bar
                        dataKey="expenses"
                        fill={T.red}
                        name="Expenses"
                        radius={[3, 3, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={css.card}>
                  <div style={css.cardTitle}>Spending by Category</div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <ResponsiveContainer width={120} height={120}>
                      <PieChart>
                        <Pie
                          data={catData}
                          cx="50%"
                          cy="50%"
                          innerRadius={36}
                          outerRadius={54}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {catData.map((e, i) => (
                            <Cell key={i} fill={e.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {catData.slice(0, 5).map((c, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 6,
                          }}
                        >
                          <div
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: 2,
                              background: c.color,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 11,
                              color: T.muted,
                              flex: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {c.name}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              color: T.text,
                              fontFamily: T.font,
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            ₹{fmt(c.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={css.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <div style={css.cardTitle}>Recent Transactions</div>
                  <span
                    style={{ fontSize: 12, color: T.gold, cursor: "pointer" }}
                    onClick={() => setView("transactions")}
                  >
                    View all →
                  </span>
                </div>
                {txns.slice(0, 7).map((t, i) => (
                  <div
                    key={t.id}
                    style={{
                      ...css.txnWrap,
                      background:
                        i % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent",
                    }}
                  >
                    <div style={css.txnDot(t.category)}>
                      {CATS[t.category]?.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          ...css.txnDesc,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t.description}
                      </div>
                      <div style={css.txnMeta}>
                        {dayLabel(t.date)} · {CATS[t.category]?.label}
                      </div>
                    </div>
                    <div style={css.txnAmt(t.type)}>
                      {t.type === "income" ? "+" : "−"}₹{fmt(t.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ─── TRANSACTIONS ─── */}
          {view === "transactions" && (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                <input
                  style={{ ...css.input, maxWidth: 260 }}
                  placeholder="Search transactions…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div style={{ display: "flex", gap: 6 }}>
                  {["all", "income", "expense"].map((f) => (
                    <button
                      key={f}
                      style={css.btnGhost(filter === f)}
                      onClick={() => setFilter(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={css.card}>
                {filteredTxns.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 0",
                      color: T.muted,
                      fontSize: 14,
                    }}
                  >
                    No transactions found.
                  </div>
                )}
                {filteredTxns.map((t, i) => (
                  <div
                    key={t.id}
                    style={{
                      ...css.txnWrap,
                      background:
                        i % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent",
                    }}
                  >
                    <div style={css.txnDot(t.category)}>
                      {CATS[t.category]?.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          ...css.txnDesc,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t.description}
                      </div>
                      <div style={css.txnMeta}>
                        {dayLabel(t.date)} · {CATS[t.category]?.label}
                      </div>
                    </div>
                    <div style={css.txnAmt(t.type)}>
                      {t.type === "income" ? "+" : "−"}₹{fmt(t.amount)}
                    </div>
                    <button
                      style={css.iconBtn}
                      onClick={() => delTxn(t.id)}
                      title="Delete"
                    >
                      <Ico d={IC.trash} size={13} stroke={T.muted} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ─── ANALYTICS ─── */}
          {view === "analytics" && (
            <>
              <div style={{ ...css.card, marginBottom: 14 }}>
                <div style={css.cardTitle}>
                  6-Month Trend — Income vs Expenses
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={T.green}
                          stopOpacity={0.22}
                        />
                        <stop
                          offset="95%"
                          stopColor={T.green}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={T.red}
                          stopOpacity={0.22}
                        />
                        <stop offset="95%" stopColor={T.red} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="2 4"
                      stroke={T.border}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: T.muted, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: T.muted, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={fmtK}
                      width={48}
                    />
                    <Tooltip content={<ChartTip />} />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke={T.green}
                      strokeWidth={2}
                      fill="url(#gInc)"
                      name="Income"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke={T.red}
                      strokeWidth={2}
                      fill="url(#gExp)"
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={css.card}>
                <div style={css.cardTitle}>Expense Breakdown by Category</div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "4px 32px",
                  }}
                >
                  {catData.map((c, i) => {
                    const pct =
                      totalCatExp > 0
                        ? Math.round((c.value / totalCatExp) * 100)
                        : 0;
                    return (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 6,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 2,
                                background: c.color,
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ fontSize: 13, color: T.text }}>
                              {c.name}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: 12,
                              color: T.muted,
                              fontFamily: T.font,
                            }}
                          >
                            ₹{fmt(c.value)}{" "}
                            <span style={{ color: c.color }}>({pct}%)</span>
                          </span>
                        </div>
                        <div
                          style={{
                            height: 4,
                            background: T.faint,
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${pct}%`,
                              background: c.color,
                              borderRadius: 3,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: `1px solid ${T.border}`,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 12,
                  }}
                >
                  {[
                    {
                      label: "Total Expenses",
                      val: `₹${fmt(catData.reduce((s, c) => s + c.value, 0))}`,
                    },
                    {
                      label: "Avg Monthly",
                      val: `₹${fmt(catData.reduce((s, c) => s + c.value, 0) / Math.max(monthlyData.length, 1))}`,
                    },
                    { label: "Top Category", val: catData[0]?.name || "—" },
                  ].map((s, i) => (
                    <div
                      key={i}
                      style={{
                        background: T.faint,
                        borderRadius: 10,
                        padding: "12px 14px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: T.muted,
                          marginBottom: 5,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: T.text,
                          fontFamily: T.font,
                        }}
                      >
                        {s.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ─── AI ADVISOR ─── */}
          {view === "ai" && (
            <div style={css.chatWrap}>
              <div
                style={{
                  background: T.goldDim,
                  border: `1px solid ${T.goldBorder}`,
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Ico d={IC.warn} size={15} stroke={T.gold} />
                  <span style={{ fontSize: 13, color: T.gold }}>
                    {quotaBlocked
                      ? "Gemini quota is exhausted. Local advisor mode is active until you add a working key or quota resets."
                      : apiKey
                        ? "Gemini is active. Responses are generated from Google Gemini API."
                        : "Add your Gemini API key to enable live AI responses."}
                  </span>
                </div>
                {(!apiKey || quotaBlocked) && (
                  <button
                    style={css.btnPrimary}
                    onClick={() => setShowKey(true)}
                  >
                    {apiKey ? "Update Key" : "Set Key"}
                  </button>
                )}
              </div>
              <div style={css.chatLog}>
                {msgs.map((m, i) => (
                  <div key={i} style={css.bubble(m.role)}>
                    <div style={css.avatar(m.role)}>
                      {m.role === "user" ? (
                        "U"
                      ) : (
                        <Ico
                          d={IC.spark}
                          size={13}
                          stroke={T.gold}
                          fill={T.gold}
                        />
                      )}
                    </div>
                    <div style={css.bubbleText(m.role)}>
                      {m.content || (
                        <span style={{ opacity: 0.4, letterSpacing: 3 }}>
                          •••
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEnd} />
              </div>
              <div style={css.chatBottom}>
                <div style={css.quickRow}>
                  {[
                    "Analyze my spending patterns",
                    "How can I increase savings?",
                    "Am I spending too much on food?",
                    "Investment advice for my income",
                  ].map((q) => (
                    <button
                      key={q}
                      style={css.quick}
                      onClick={() => setChatInput(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <div style={css.chatRow}>
                  <input
                    style={{ ...css.input, flex: 1 }}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && sendMsg()
                    }
                    placeholder="Ask about your finances…"
                    disabled={streaming}
                  />
                  <button
                    style={{
                      ...css.btnPrimary,
                      padding: "9px 16px",
                      opacity: streaming ? 0.5 : 1,
                    }}
                    onClick={sendMsg}
                    disabled={streaming}
                  >
                    <Ico d={IC.send} size={15} stroke={T.bg} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── ADD TRANSACTION MODAL ── */}
      {showAdd && (
        <div style={css.overlay} onClick={() => setShowAdd(false)}>
          <div style={css.modal} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div style={css.modalTitle}>Add Transaction</div>
              <button style={css.iconBtn} onClick={() => setShowAdd(false)}>
                <Ico d={IC.x} size={17} stroke={T.muted} />
              </button>
            </div>
            <div style={css.typeToggle}>
              {["expense", "income"].map((t) => (
                <button
                  key={t}
                  style={{
                    ...css.btnGhost(newT.type === t),
                    flex: 1,
                    justifyContent: "center",
                    textTransform: "capitalize",
                  }}
                  onClick={() =>
                    setNewT((p) => ({
                      ...p,
                      type: t,
                      category: t === "income" ? "salary" : "food",
                    }))
                  }
                >
                  <span style={{ color: t === "income" ? T.green : T.red }}>
                    {t === "income" ? "↑" : "↓"}
                  </span>{" "}
                  {t}
                </button>
              ))}
            </div>
            {[
              {
                label: "Description",
                key: "description",
                type: "text",
                ph: "e.g. Zomato Order",
              },
              { label: "Amount (₹)", key: "amount", type: "number", ph: "0" },
              { label: "Date", key: "date", type: "date", ph: "" },
            ].map((f) => (
              <div key={f.key} style={css.formRow}>
                <label style={css.formLabel}>{f.label}</label>
                <input
                  style={css.input}
                  type={f.type}
                  value={newT[f.key]}
                  placeholder={f.ph}
                  onChange={(e) =>
                    setNewT((p) => ({ ...p, [f.key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div style={css.formRow}>
              <label style={css.formLabel}>Category</label>
              <select
                style={css.select}
                value={newT.category}
                onChange={(e) =>
                  setNewT((p) => ({ ...p, category: e.target.value }))
                }
              >
                {Object.entries(CATS)
                  .filter(([, v]) => v.type === newT.type)
                  .map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.icon} {v.label}
                    </option>
                  ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button
                style={{ ...css.btnPrimary, flex: 1, padding: "11px" }}
                onClick={addTxn}
              >
                Add Transaction
              </button>
              <button
                style={{ ...css.btnGhost(false), padding: "11px 16px" }}
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── GETTING STARTED MODAL ── */}
      {showSetup && (
        <div
          style={css.overlay}
          onClick={() => setupProfile && setShowSetup(false)}
        >
          <div
            style={{ ...css.modal, maxWidth: 560 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div style={css.modalTitle}>Getting Started</div>
              {setupProfile && (
                <button style={css.iconBtn} onClick={() => setShowSetup(false)}>
                  <Ico d={IC.x} size={17} stroke={T.muted} />
                </button>
              )}
            </div>
            <p
              style={{
                fontSize: 13,
                color: T.muted,
                marginBottom: 14,
                lineHeight: 1.6,
              }}
            >
              Add your monthly numbers once. Vyqora will create your initial
              dashboard entries from this plan.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {[
                ["Your Name", "name", "text", "e.g. Rahul"],
                ["Monthly Income (₹)", "monthlyIncome", "number", "60000"],
                ["Rent (₹)", "rent", "number", "15000"],
                ["Food Budget (₹)", "food", "number", "7000"],
                ["Transport (₹)", "transport", "number", "3000"],
                ["Utilities (₹)", "utilities", "number", "2500"],
                ["Lifestyle/Wants (₹)", "lifestyle", "number", "5000"],
                ["Savings Target (%)", "savingsTargetRate", "number", "25"],
              ].map(([label, key, type, ph]) => (
                <div key={key} style={css.formRow}>
                  <label style={css.formLabel}>{label}</label>
                  <input
                    style={css.input}
                    type={type}
                    value={setupForm[key] ?? ""}
                    placeholder={ph}
                    onChange={(e) =>
                      setSetupForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button
                style={{ ...css.btnPrimary, flex: 1, padding: "11px" }}
                onClick={applySetup}
              >
                Save & Build Dashboard
              </button>
              {setupProfile && (
                <button
                  style={{ ...css.btnGhost(false), padding: "11px 16px" }}
                  onClick={() => setShowSetup(false)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── GEMINI API KEY MODAL ── */}
      {showKey && (
        <div style={css.overlay} onClick={() => setShowKey(false)}>
          <div style={css.modal} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div style={css.modalTitle}>Google Gemini API Key</div>
              <button style={css.iconBtn} onClick={() => setShowKey(false)}>
                <Ico d={IC.x} size={17} stroke={T.muted} />
              </button>
            </div>
            <p
              style={{
                fontSize: 13,
                color: T.muted,
                marginBottom: 16,
                lineHeight: 1.65,
              }}
            >
              Create your key in Google AI Studio. Free tier is usually
              available with usage limits. Your key is stored only in this
              browser (localStorage).
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              style={{
                color: T.gold,
                fontSize: 13,
                display: "inline-block",
                marginBottom: 12,
              }}
            >
              Open AI Studio API Keys
            </a>
            <input
              style={{ ...css.input, marginBottom: apiKey ? 8 : 16 }}
              type="password"
              placeholder="AIza..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveKey()}
            />
            {apiKey && (
              <div style={{ fontSize: 12, color: T.green, marginBottom: 14 }}>
                ✓ Gemini API key is currently active
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{ ...css.btnPrimary, flex: 1, padding: "11px" }}
                onClick={saveKey}
                disabled={!keyInput.trim()}
              >
                Save Key
              </button>
              {apiKey && (
                <button style={css.btnDanger} onClick={clearKey}>
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
