import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Eye
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

const KPIs = [
  { label: "Chiffre d'affaires", value: "4 820 000 DA", change: "+12.5%", up: true, icon: DollarSign, color: "#FF6B35" },
  { label: "Commandes", value: "342", change: "+8.2%", up: true, icon: ShoppingCart, color: "#3B82F6" },
  { label: "Clients actifs", value: "1 247", change: "+5.1%", up: true, icon: Users, color: "#10B981" },
  { label: "Produits en stock", value: "856", change: "-2.3%", up: false, icon: Package, color: "#8B5CF6" },
];

const revenueData = [
  { month: "Jan", revenue: 2800000, orders: 210 },
  { month: "Fév", revenue: 3100000, orders: 245 },
  { month: "Mar", revenue: 2900000, orders: 228 },
  { month: "Avr", revenue: 3500000, orders: 278 },
  { month: "Mai", revenue: 3900000, orders: 310 },
  { month: "Jun", revenue: 4200000, orders: 325 },
  { month: "Jul", revenue: 4500000, orders: 342 },
];

const categoryData = [
  { name: "Réfrigérateurs", value: 28, color: "#FF6B35" },
  { name: "Machines à laver", value: 22, color: "#3B82F6" },
  { name: "Climatiseurs", value: 18, color: "#10B981" },
  { name: "TV & Son", value: 15, color: "#8B5CF6" },
  { name: "Fours", value: 10, color: "#F59E0B" },
  { name: "Autres", value: 7, color: "#6B7280" },
];

const topProducts = [
  { name: "Samsung RF23 Multi-Portes", sold: 48, revenue: "9 072 000 DA", trend: "+15%" },
  { name: "LG OLED 55\" C3", sold: 32, revenue: "6 496 000 DA", trend: "+22%" },
  { name: "Bosch EcoSilence 9kg", sold: 41, revenue: "4 469 000 DA", trend: "+8%" },
  { name: "Miele Silence Plus", sold: 24, revenue: "4 176 000 DA", trend: "+5%" },
  { name: "Roborock S7 MaxV", sold: 38, revenue: "3 040 000 DA", trend: "+31%" },
];

const recentOrders = [
  { id: "CMD-2841", client: "Mohamed Benali", total: "189 000 DA", status: "Livrée", statusColor: "#10B981", date: "26 Mar 2026" },
  { id: "CMD-2840", client: "Amira Khelifi", total: "312 000 DA", status: "En cours", statusColor: "#3B82F6", date: "26 Mar 2026" },
  { id: "CMD-2839", client: "Youcef Hamidi", total: "94 000 DA", status: "En préparation", statusColor: "#F59E0B", date: "25 Mar 2026" },
  { id: "CMD-2838", client: "Fatima Zahra Boukhari", total: "174 000 DA", status: "Livrée", statusColor: "#10B981", date: "25 Mar 2026" },
  { id: "CMD-2837", client: "Karim Djaballah", total: "69 000 DA", status: "Annulée", statusColor: "#EF4444", date: "25 Mar 2026" },
  { id: "CMD-2836", client: "Nour El Houda Saidi", total: "203 000 DA", status: "En cours", statusColor: "#3B82F6", date: "24 Mar 2026" },
];

const weeklyOrders = [
  { day: "Lun", orders: 42 },
  { day: "Mar", orders: 58 },
  { day: "Mer", orders: 35 },
  { day: "Jeu", orders: 67 },
  { day: "Ven", orders: 52 },
  { day: "Sam", orders: 78 },
  { day: "Dim", orders: 24 },
];

function formatRevenue(value: number) {
  return (value / 1000000).toFixed(1) + "M";
}

export function AdminDashboard() {
  return (
    <div className="space-y-6" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPIs.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white dark:bg-[#1E1E24] rounded-xl p-5 border border-[#E5E7EB] dark:border-white/10"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: kpi.color + "15" }}
              >
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
              </div>
              <span
                className={`flex items-center gap-1 text-[12px] px-2 py-0.5 rounded-full ${
                  kpi.up
                    ? "bg-[#10B981]/10 text-[#10B981]"
                    : "bg-[#EF4444]/10 text-[#EF4444]"
                }`}
                style={{ fontWeight: 500 }}
              >
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-[13px] text-[#6B7280] dark:text-white/50">{kpi.label}</p>
            <p className="text-[22px] text-[#1A2332] dark:text-white mt-0.5" style={{ fontWeight: 700 }}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-[#1E1E24] rounded-xl p-5 border border-[#E5E7EB] dark:border-white/10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[15px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>
                Chiffre d'affaires
              </h3>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">7 derniers mois</p>
            </div>
            <button className="text-[#9CA3AF] hover:text-[#6B7280]">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} tickFormatter={formatRevenue} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A2332",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#fff",
                }}
                formatter={(value: number) => [value.toLocaleString("fr-DZ") + " DA", "CA"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2.5} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="bg-white dark:bg-[#1E1E24] rounded-xl p-5 border border-[#E5E7EB] dark:border-white/10">
          <h3 className="text-[15px] text-[#1A2332] dark:text-white mb-1" style={{ fontWeight: 600 }}>
            Ventes par catégorie
          </h3>
          <p className="text-[12px] text-[#9CA3AF] mb-4">Ce mois</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1A2332", border: "none", borderRadius: 8, fontSize: 12, color: "#fff" }}
                formatter={(value: number) => [value + "%"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[#6B7280] dark:text-white/60">{cat.name}</span>
                </div>
                <span className="text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white dark:bg-[#1E1E24] rounded-xl border border-[#E5E7EB] dark:border-white/10">
          <div className="flex items-center justify-between p-5 pb-0">
            <div>
              <h3 className="text-[15px] text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>
                Commandes récentes
              </h3>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">Dernières 48h</p>
            </div>
            <button className="text-[12px] text-[#FF6B35] flex items-center gap-1 hover:underline" style={{ fontWeight: 500 }}>
              Voir tout <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] mt-4">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-white/10">
                  <th className="text-left px-5 pb-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>
                    ID
                  </th>
                  <th className="text-left pb-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>
                    Client
                  </th>
                  <th className="text-left pb-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>
                    Total
                  </th>
                  <th className="text-left pb-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>
                    Statut
                  </th>
                  <th className="text-left pb-3 text-[11px] uppercase tracking-wider text-[#9CA3AF]" style={{ fontWeight: 500 }}>
                    Date
                  </th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#E5E7EB]/50 dark:border-white/5 hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-[#1A2332] dark:text-white" style={{ fontWeight: 600 }}>
                      {order.id}
                    </td>
                    <td className="py-3 text-[#6B7280] dark:text-white/70">{order.client}</td>
                    <td className="py-3 text-[#1A2332] dark:text-white" style={{ fontWeight: 500 }}>
                      {order.total}
                    </td>
                    <td className="py-3">
                      <span
                        className="inline-flex px-2.5 py-0.5 rounded-full text-[11px]"
                        style={{
                          fontWeight: 500,
                          backgroundColor: order.statusColor + "15",
                          color: order.statusColor,
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-[#9CA3AF]">{order.date}</td>
                    <td className="py-3 pr-5">
                      <button className="text-[#9CA3AF] hover:text-[#FF6B35] transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products + Weekly Orders */}
        <div className="space-y-4">
          {/* Top Products */}
          <div className="bg-white dark:bg-[#1E1E24] rounded-xl p-5 border border-[#E5E7EB] dark:border-white/10">
            <h3 className="text-[15px] text-[#1A2332] dark:text-white mb-4" style={{ fontWeight: 600 }}>
              Top produits
            </h3>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] shrink-0"
                    style={{
                      fontWeight: 600,
                      backgroundColor: i < 3 ? "#FF6B35" : "#E5E7EB",
                      color: i < 3 ? "#fff" : "#6B7280",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#1A2332] dark:text-white truncate" style={{ fontWeight: 500 }}>
                      {p.name}
                    </p>
                    <p className="text-[11px] text-[#9CA3AF]">{p.sold} vendus</p>
                  </div>
                  <span className="text-[11px] text-[#10B981]" style={{ fontWeight: 500 }}>
                    {p.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Orders Bar Chart */}
          <div className="bg-white dark:bg-[#1E1E24] rounded-xl p-5 border border-[#E5E7EB] dark:border-white/10">
            <h3 className="text-[15px] text-[#1A2332] dark:text-white mb-1" style={{ fontWeight: 600 }}>
              Commandes cette semaine
            </h3>
            <p className="text-[12px] text-[#9CA3AF] mb-4">356 total</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={weeklyOrders}>
                <Bar dataKey="orders" fill="#FF6B35" radius={[4, 4, 0, 0]} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A2332", border: "none", borderRadius: 8, fontSize: 12, color: "#fff" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
