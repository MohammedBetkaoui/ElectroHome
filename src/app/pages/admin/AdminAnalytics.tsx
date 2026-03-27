import { useState } from "react";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Eye, Package,
  ArrowUpRight, ArrowDownRight, Calendar, Download, Filter
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart
} from "recharts";

function formatPrice(p: number) { return p.toLocaleString("fr-DZ") + " DA"; }

const PERIODS = ["7 jours", "30 jours", "90 jours", "6 mois", "1 an"];

const dailyRevenue = [
  { day: "21 Mar", revenue: 580000, orders: 14, visitors: 342 },
  { day: "22 Mar", revenue: 720000, orders: 18, visitors: 410 },
  { day: "23 Mar", revenue: 490000, orders: 11, visitors: 298 },
  { day: "24 Mar", revenue: 860000, orders: 22, visitors: 520 },
  { day: "25 Mar", revenue: 1150000, orders: 28, visitors: 645 },
  { day: "26 Mar", revenue: 940000, orders: 24, visitors: 580 },
  { day: "27 Mar", revenue: 780000, orders: 19, visitors: 470 },
];

const monthlyTrend = [
  { month: "Avr 25", revenue: 2400000, orders: 185 },
  { month: "Mai", revenue: 2900000, orders: 220 },
  { month: "Jun", revenue: 3100000, orders: 248 },
  { month: "Jul", revenue: 3500000, orders: 275 },
  { month: "Aoû", revenue: 4200000, orders: 310 },
  { month: "Sep", revenue: 3800000, orders: 295 },
  { month: "Oct", revenue: 3200000, orders: 260 },
  { month: "Nov", revenue: 5100000, orders: 385 },
  { month: "Déc", revenue: 4600000, orders: 350 },
  { month: "Jan 26", revenue: 3000000, orders: 240 },
  { month: "Fév", revenue: 3400000, orders: 268 },
  { month: "Mar", revenue: 4820000, orders: 342 },
];

const categoryRevenue = [
  { name: "Réfrigérateurs", revenue: 1450000, color: "#FF6B35" },
  { name: "Machines à laver", revenue: 1120000, color: "#3B82F6" },
  { name: "Climatiseurs", revenue: 980000, color: "#10B981" },
  { name: "Fours & Cuisinières", revenue: 650000, color: "#8B5CF6" },
  { name: "Petit électroménager", revenue: 420000, color: "#F59E0B" },
  { name: "Aspirateurs", revenue: 200000, color: "#EF4444" },
];

const trafficSources = [
  { name: "Recherche Google", value: 42, color: "#FF6B35" },
  { name: "Direct", value: 28, color: "#3B82F6" },
  { name: "Réseaux sociaux", value: 18, color: "#10B981" },
  { name: "Référencement", value: 8, color: "#8B5CF6" },
  { name: "Autres", value: 4, color: "#9CA3AF" },
];

const hourlyVisitors = [
  { hour: "00h", visitors: 12 }, { hour: "02h", visitors: 5 }, { hour: "04h", visitors: 3 },
  { hour: "06h", visitors: 8 }, { hour: "08h", visitors: 45 }, { hour: "10h", visitors: 98 },
  { hour: "12h", visitors: 125 }, { hour: "14h", visitors: 110 }, { hour: "16h", visitors: 135 },
  { hour: "18h", visitors: 165 }, { hour: "20h", visitors: 142 }, { hour: "22h", visitors: 68 },
];

const topProducts = [
  { name: "Samsung RT38 Réfrigérateur", sales: 42, revenue: 1890000 },
  { name: "LG F4V5 Machine à laver", sales: 38, revenue: 1520000 },
  { name: "Condor Alpha Climatiseur 12K", sales: 35, revenue: 1225000 },
  { name: "Brandt BCH6400 Cuisinière", sales: 28, revenue: 840000 },
  { name: "Moulinex CE704 Cookeo", sales: 25, revenue: 625000 },
];

const topCities = [
  { city: "Bordj Bou Arréridj", orders: 142, pct: 41.5 },
  { city: "Sétif", orders: 58, pct: 17.0 },
  { city: "Alger", orders: 45, pct: 13.2 },
  { city: "M'sila", orders: 32, pct: 9.4 },
  { city: "Béjaïa", orders: 28, pct: 8.2 },
  { city: "Constantine", orders: 22, pct: 6.4 },
  { city: "Autres", orders: 15, pct: 4.3 },
];

const conversionFunnel = [
  { stage: "Visiteurs", value: 12500, color: "#3B82F6" },
  { stage: "Ajout panier", value: 2800, color: "#8B5CF6" },
  { stage: "Checkout", value: 980, color: "#F59E0B" },
  { stage: "Commandes", value: 342, color: "#10B981" },
];

export function AdminAnalytics() {
  const [period, setPeriod] = useState("30 jours");

  const kpis = [
    { label: "Chiffre d'affaires", value: formatPrice(4820000), change: "+12.5%", up: true, icon: DollarSign, color: "#FF6B35" },
    { label: "Commandes", value: "342", change: "+8.2%", up: true, icon: ShoppingCart, color: "#3B82F6" },
    { label: "Visiteurs uniques", value: "12 500", change: "+15.7%", up: true, icon: Eye, color: "#10B981" },
    { label: "Taux de conversion", value: "2.74%", change: "+0.3%", up: true, icon: TrendingUp, color: "#8B5CF6" },
    { label: "Panier moyen", value: formatPrice(14093), change: "-2.1%", up: false, icon: Package, color: "#F59E0B" },
    { label: "Nouveaux clients", value: "186", change: "+22.4%", up: true, icon: Users, color: "#EF4444" },
  ];

  return (
    <div className="space-y-5" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Period selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-1">
          {PERIODS.map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-2 rounded-lg text-[12px] transition-colors ${period === p ? "bg-[#FF6B35] text-white" : "text-[#6B7280] hover:text-[#1A2332] dark:hover:text-white"}`}
              style={{ fontWeight: period === p ? 600 : 400 }}>{p}</button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[13px] text-[#6B7280] hover:border-[#FF6B35] hover:text-[#FF6B35]" style={{ fontWeight: 500 }}>
          <Download className="w-4 h-4" /> Exporter PDF
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: k.color + "15" }}>
                <k.icon className="w-4 h-4" style={{ color: k.color }} />
              </div>
              <span className={`flex items-center gap-0.5 text-[11px] ${k.up ? "text-[#10B981]" : "text-[#EF4444]"}`} style={{ fontWeight: 500 }}>
                {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {k.change}
              </span>
            </div>
            <p className="text-[17px] text-[#1A2332] dark:text-white truncate" style={{ fontWeight: 700 }}>{k.value}</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue + Orders trend */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
          <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>Évolution du CA & Commandes (12 mois)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="aRevG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "'Sora'" }}
                  formatter={(value: number, name: string) => [name === "revenue" ? formatPrice(value) : value, name === "revenue" ? "CA" : "Commandes"]} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2.5} fill="url(#aRevG)" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
          <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>Entonnoir de conversion</h3>
          <div className="space-y-3">
            {conversionFunnel.map((s, i) => {
              const pct = (s.value / conversionFunnel[0].value) * 100;
              const dropoff = i > 0 ? ((1 - s.value / conversionFunnel[i - 1].value) * 100).toFixed(1) : null;
              return (
                <div key={s.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-[#6B7280]">{s.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{s.value.toLocaleString()}</span>
                      {dropoff && <span className="text-[10px] text-[#EF4444]">-{dropoff}%</span>}
                    </div>
                  </div>
                  <div className="w-full h-8 bg-[#F3F4F6] dark:bg-white/5 rounded-lg overflow-hidden">
                    <div className="h-full rounded-lg transition-all flex items-center justify-end pr-2" style={{ width: `${pct}%`, backgroundColor: s.color + "25" }}>
                      <span className="text-[10px]" style={{ color: s.color, fontWeight: 600 }}>{pct.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily + Category revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
          <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>Revenus quotidiens (7 derniers jours)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }}
                  formatter={(v: number) => [formatPrice(v), "CA"]} />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={36} fill="#FF6B35" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
          <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>CA par catégorie</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryRevenue} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
                <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }}
                  formatter={(v: number) => [formatPrice(v), "CA"]} />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={16}>
                  {categoryRevenue.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Traffic sources + Hourly visitors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
          <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>Sources de trafic</h3>
          <div className="h-[250px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3} strokeWidth={0}>
                  {trafficSources.map((s) => <Cell key={s.name} fill={s.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }} formatter={(v: number) => [v + "%", ""]} />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" iconSize={8}
                  wrapperStyle={{ fontSize: 11, fontFamily: "'Sora'" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
          <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>Visiteurs par heure (aujourd'hui)</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyVisitors}>
                <defs>
                  <linearGradient id="hVG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Area type="monotone" dataKey="visitors" stroke="#10B981" strokeWidth={2} fill="url(#hVG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products + Top Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
          <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>Top 5 produits vendus</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center text-[12px] text-[#6B7280]" style={{ fontWeight: 600 }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#1A2332] dark:text-white truncate" style={{ fontWeight: 500 }}>{p.name}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{p.sales} ventes</p>
                </div>
                <span className="text-[13px] text-[#FF6B35] shrink-0" style={{ fontWeight: 600 }}>{formatPrice(p.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10 p-5">
          <h3 className="text-[14px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>Commandes par ville</h3>
          <div className="space-y-2.5">
            {topCities.map((c) => (
              <div key={c.city}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>{c.city}</span>
                  <span className="text-[12px] text-[#6B7280]">{c.orders} ({c.pct}%)</span>
                </div>
                <div className="w-full h-2 bg-[#F3F4F6] dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#FF6B35]" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
