"use client";

import { useState, useEffect } from "react";
import { getAdminChartData, Period } from "../actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Bar, 
    BarChart, 
    Line, 
    LineChart, 
    Area,
    AreaChart,
    ResponsiveContainer, 
    Tooltip, 
    XAxis, 
    YAxis, 
    PieChart, 
    Pie, 
    Cell,
    CartesianGrid,
    Legend
} from "recharts";
import { 
    Loader2, 
    Eye, 
    Users, 
    Calendar, 
    TrendingUp, 
    Globe, 
    Monitor, 
    Smartphone, 
    Tablet, 
    Compass,
    ExternalLink,
    Clock,
    Layers
} from "lucide-react";

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(value);
}

const DEVICE_ICONS: Record<string, React.ReactNode> = {
    Desktop: <Monitor className="w-4 h-4 text-blue-500" />,
    Mobile: <Smartphone className="w-4 h-4 text-emerald-500" />,
    Tablet: <Tablet className="w-4 h-4 text-purple-500" />
};

export function AdminCharts() {
    const [period, setPeriod] = useState<Period>("monthly");
    const [data, setData] = useState<{
        revenue: any[];
        enrollments: any[];
        distribution: any[];
        traffic: {
            timeline: { date: string; views: number; uniques: number }[];
            topPages: { path: string; views: number; uniques: number; percentage: number }[];
            topReferrers: { name: string; count: number }[];
            devices: { device: string; count: number }[];
            summary: {
                periodViews: number;
                periodUniques: number;
                todayViews: number;
                todayUniques: number;
                weekViews: number;
                weekUniques: number;
                monthViews: number;
                monthUniques: number;
                yearViews: number;
                yearUniques: number;
                allTimeViews: number;
                allTimeUniques: number;
            };
        };
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getAdminChartData(period);
                setData(result);
            } catch (error) {
                console.error("Failed to fetch chart data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [period]);

    const formatXAxisDate = (value: string) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        if (period === 'daily') {
            return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        }
        if (period === 'weekly') {
            return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        }
        if (period === 'monthly') {
            return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
        }
        if (period === 'yearly') {
            return date.toLocaleDateString('en-IN', { year: 'numeric' });
        }
        return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    };

    const summary = data?.traffic?.summary;

    return (
        <div className="space-y-8">
            {/* TOP BAR WITH PERIOD SELECTOR */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analytics & Traffic Overview</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        View website traffic, user acquisition, revenue, and enrollment performance.
                    </p>
                </div>
                <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto border border-slate-200/60 dark:border-slate-700/60">
                    {(["daily", "weekly", "monthly", "yearly", "all"] as Period[]).map((p) => (
                        <Button
                            key={p}
                            variant={period === p ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setPeriod(p)}
                            className={`capitalize text-xs font-semibold px-3 py-1.5 transition-all rounded-lg ${
                                period === p
                                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            {p === "daily" ? "Per Day" : p === "weekly" ? "Per Week" : p === "monthly" ? "Monthly" : p === "yearly" ? "Yearly" : "All Time"}
                        </Button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="h-[400px] flex items-center justify-center border rounded-xl bg-white dark:bg-slate-900">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* WEBSITE TRAFFIC KPI CARDS (Day, Week, Month, Year) */}
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                        {/* TODAY */}
                        <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50/50 via-white to-white dark:from-slate-900 dark:to-slate-900 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" /> Today's Traffic
                                </span>
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                                    Live
                                </span>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {(summary?.todayViews ?? 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">views</span>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                    <Users className="w-3 h-3 text-slate-400" />
                                    <span>{(summary?.todayUniques ?? 0).toLocaleString()} unique visitors</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* THIS WEEK */}
                        <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50/50 via-white to-white dark:from-slate-900 dark:to-slate-900 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" /> This Week
                                </span>
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                    7 Days
                                </span>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {(summary?.weekViews ?? 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">views</span>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                    <Users className="w-3 h-3 text-slate-400" />
                                    <span>{(summary?.weekUniques ?? 0).toLocaleString()} unique visitors</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* THIS MONTH */}
                        <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50/50 via-white to-white dark:from-slate-900 dark:to-slate-900 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5" /> This Month
                                </span>
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                    30 Days
                                </span>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {(summary?.monthViews ?? 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">views</span>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                    <Users className="w-3 h-3 text-slate-400" />
                                    <span>{(summary?.monthUniques ?? 0).toLocaleString()} unique visitors</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* THIS YEAR */}
                        <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-gradient-to-br from-amber-50/50 via-white to-white dark:from-slate-900 dark:to-slate-900 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                    <Globe className="w-3.5 h-3.5" /> This Year
                                </span>
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                                    Yearly
                                </span>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {(summary?.yearViews ?? 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">views</span>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                    <Users className="w-3 h-3 text-slate-400" />
                                    <span>{(summary?.yearUniques ?? 0).toLocaleString()} unique visitors</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* MAIN TRAFFIC CHART: PAGE VIEWS & UNIQUE VISITORS */}
                    <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-indigo-600" />
                                    Website Traffic & Unique Visitors
                                </CardTitle>
                                <CardDescription>
                                    Page views and unique visitors tracked across {period === "daily" ? "days" : period === "weekly" ? "weeks" : period === "monthly" ? "months" : "years"}.
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-indigo-600" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Total Views ({summary?.periodViews.toLocaleString() ?? 0})</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Unique Visitors ({summary?.periodUniques.toLocaleString() ?? 0})</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 pl-2 pr-4">
                            <div className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data?.traffic?.timeline}>
                                        <defs>
                                            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                                            </linearGradient>
                                            <linearGradient id="uniquesGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-slate-800" />
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="#888888" 
                                            fontSize={12} 
                                            tickLine={false} 
                                            axisLine={false} 
                                            tickFormatter={formatXAxisDate}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            allowDecimals={false}
                                        />
                                        <Tooltip 
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const rawDate = payload[0].payload.date;
                                                    const formattedDate = new Date(rawDate).toLocaleDateString('en-IN', {
                                                        weekday: period === 'daily' ? 'short' : undefined,
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    });
                                                    return (
                                                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 shadow-lg text-xs space-y-2">
                                                            <div className="font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">
                                                                {formattedDate}
                                                            </div>
                                                            <div className="flex items-center justify-between gap-4">
                                                                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                                                                    <Eye className="w-3.5 h-3.5" /> Page Views
                                                                </span>
                                                                <span className="font-bold text-slate-900 dark:text-white">
                                                                    {Number(payload[0]?.value || 0).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between gap-4">
                                                                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                                                                    <Users className="w-3.5 h-3.5" /> Unique Visitors
                                                                </span>
                                                                <span className="font-bold text-slate-900 dark:text-white">
                                                                    {Number(payload[1]?.value || 0).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="views"
                                            stroke="#6366f1"
                                            strokeWidth={2.5}
                                            fillOpacity={1}
                                            fill="url(#viewsGradient)"
                                            name="Page Views"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="uniques"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#uniquesGradient)"
                                            name="Unique Visitors"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* TOP PAGES & BREAKDOWN SECTION */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        {/* TOP VISITED PAGES */}
                        <Card className="lg:col-span-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-indigo-600" />
                                    Top Visited Pages
                                </CardTitle>
                                <CardDescription>
                                    Most popular routes and page view distribution.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {data?.traffic?.topPages && data.traffic.topPages.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.traffic.topPages.map((page, idx) => (
                                            <div key={page.path || idx} className="space-y-1.5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200 truncate max-w-[240px]">
                                                        {page.path === "/" ? "/ (Homepage)" : page.path}
                                                    </span>
                                                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                            {page.views.toLocaleString()} views
                                                        </span>
                                                        <span className="text-[11px] text-slate-400">
                                                            ({page.uniques.toLocaleString()} unique)
                                                        </span>
                                                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 min-w-[32px] text-right">
                                                            {page.percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500" 
                                                        style={{ width: `${Math.min(100, Math.max(4, page.percentage))}%` }} 
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-xs text-slate-400">
                                        No page view data recorded for this period yet.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* TRAFFIC SOURCES & DEVICES */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* DEVICES */}
                            <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <Monitor className="w-4 h-4 text-indigo-600" />
                                        Device Breakdown
                                    </CardTitle>
                                    <CardDescription>
                                        Visitor devices across desktop, mobile, and tablet.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        {data?.traffic?.devices?.map((dev) => {
                                            const total = (data.traffic.devices || []).reduce((acc, d) => acc + d.count, 0);
                                            const pct = total > 0 ? Math.round((dev.count / total) * 100) : 0;
                                            return (
                                                <div key={dev.device} className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-center bg-slate-50/50 dark:bg-slate-950/40">
                                                    <div className="flex justify-center mb-1.5">
                                                        {DEVICE_ICONS[dev.device] || <Monitor className="w-4 h-4 text-slate-500" />}
                                                    </div>
                                                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{dev.device}</div>
                                                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{dev.count.toLocaleString()}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium">{pct}% of visits</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* REFERRAL SOURCES */}
                            <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <Compass className="w-4 h-4 text-indigo-600" />
                                        Top Traffic Sources
                                    </CardTitle>
                                    <CardDescription>
                                        Where visitors are discovering your website from.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-3">
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                        {data?.traffic?.topReferrers && data.traffic.topReferrers.length > 0 ? (
                                            data.traffic.topReferrers.map((ref, idx) => (
                                                <div key={ref.name || idx} className="py-2 flex items-center justify-between">
                                                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                                                        {ref.name}
                                                    </span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {ref.count.toLocaleString()} visits
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-slate-400">
                                                No referrer data available.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* FINANCIAL & COURSE METRICS SECTION */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                            Platform Sales & Student Enrollments
                        </h3>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        {/* REVENUE CHART */}
                        <Card className="md:col-span-4 lg:col-span-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                            <CardHeader>
                                <CardTitle>Revenue Received</CardTitle>
                                <CardDescription>
                                    Total income from course sales over the selected period.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                 <div className="h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data?.revenue}>
                                            <XAxis 
                                                dataKey="date" 
                                                stroke="#888888" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false} 
                                                tickFormatter={formatXAxisDate}
                                            />
                                            <YAxis
                                                stroke="#888888"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `₹${value}`}
                                            />
                                            <Tooltip 
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="rounded-lg border bg-white p-2 shadow-sm dark:bg-black dark:border-slate-800">
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                                                                        <span className="font-bold text-muted-foreground">{payload[0].payload.date}</span>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Revenue</span>
                                                                        <span className="font-bold">{formatCurrency(payload[0].value as number)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Bar
                                                dataKey="amount"
                                                fill="#10b981"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                 </div>
                            </CardContent>
                        </Card>

                        {/* ENROLLMENT BY COURSE */}
                        <Card className="md:col-span-3 lg:col-span-3 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                            <CardHeader>
                                <CardTitle>Enrollment Distribution</CardTitle>
                                 <CardDescription>
                                    Which courses are most popular?
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data?.distribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="count"
                                            >
                                                {(data?.distribution || []).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} strokeWidth={0} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                         {/* ENROLLMENT TREND */}
                         <Card className="md:col-span-4 lg:col-span-7 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                            <CardHeader>
                                <CardTitle>Enrollment Trends</CardTitle>
                                <CardDescription>
                                    Number of new students joining over time.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                 <div className="h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data?.enrollments}>
                                            <XAxis 
                                                dataKey="date" 
                                                stroke="#888888" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false} 
                                                tickFormatter={formatXAxisDate}
                                            />
                                            <YAxis
                                                stroke="#888888"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-slate-800" />
                                            <Tooltip 
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="rounded-lg border bg-white p-2 shadow-sm dark:bg-black dark:border-slate-800">
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                                                                        <span className="font-bold text-muted-foreground">{payload[0].payload.date}</span>
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Enrollments</span>
                                                                        <span className="font-bold">{payload[0].value}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#6366f1"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                 </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
