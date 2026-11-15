"use server";

import { db } from "@/db";
import { payments, enrollments, courses, websiteVisits } from "@/db/schema";
import { sql, eq, and, gte } from "drizzle-orm";

export type Period = "daily" | "weekly" | "monthly" | "yearly" | "all";

export async function getAdminChartData(period: Period) {
  const now = new Date();
  let startDate: Date;
  let truncType = "day";

  // Determine date range and trunc granularity
  switch (period) {
    case "daily":
      startDate = new Date();
      startDate.setDate(now.getDate() - 30);
      truncType = "day";
      break;
    case "weekly":
      startDate = new Date();
      startDate.setDate(now.getDate() - 90); // ~12 weeks
      truncType = "week";
      break;
    case "monthly":
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1); // 12 months
      truncType = "month";
      break;
    case "yearly":
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 5); // 5 years
      truncType = "year";
      break;
    case "all":
      startDate = new Date(0); // Beginning of time
      truncType = "month";
      break;
  }

  // --- REVENUE CHART DATA ---
  const revenueData = await db
    .select({
      date: sql<Date>`date_trunc(${truncType}, ${payments.createdAt})`,
      amount: sql<number>`sum(${payments.amount}) / 100`, // Convert paise to rupees
    })
    .from(payments)
    .where(and(eq(payments.status, "captured"), gte(payments.createdAt, startDate)))
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  // --- ENROLLMENT OVER TIME ---
  const enrollmentData = await db
    .select({
      date: sql<Date>`date_trunc(${truncType}, ${enrollments.createdAt})`,
      count: sql<number>`count(*)`,
    })
    .from(enrollments)
    .where(gte(enrollments.createdAt, startDate))
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  // --- COURSE DISTRIBUTION ---
  const courseDistribution = await db
    .select({
      name: courses.title,
      count: sql<number>`count(${enrollments.id})`,
    })
    .from(enrollments)
    .leftJoin(courses, eq(enrollments.courseId, courses.id))
    .where(gte(enrollments.createdAt, startDate))
    .groupBy(courses.id, courses.title)
    .orderBy(sql`count(${enrollments.id}) DESC`);

  // --- WEBSITE TRAFFIC OVER TIME (Day, Week, Month, Year) ---
  const trafficData = await db
    .select({
      date: sql<Date>`date_trunc(${truncType}, ${websiteVisits.createdAt})`,
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, startDate))
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  // --- TOP VISITED PAGES ---
  const topPagesData = await db
    .select({
      path: websiteVisits.path,
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, startDate))
    .groupBy(websiteVisits.path)
    .orderBy(sql`count(*) DESC`)
    .limit(10);

  // --- TRAFFIC SOURCES (REFERRERS) ---
  const topReferrersData = await db
    .select({
      name: websiteVisits.referrer,
      count: sql<number>`count(*)`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, startDate))
    .groupBy(websiteVisits.referrer)
    .orderBy(sql`count(*) DESC`)
    .limit(6);

  // --- DEVICE BREAKDOWN ---
  const devicesData = await db
    .select({
      device: websiteVisits.device,
      count: sql<number>`count(*)`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, startDate))
    .groupBy(websiteVisits.device)
    .orderBy(sql`count(*) DESC`);

  // --- SUMMARY KPI METRICS ---
  // Today's midnight
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Week start (Monday)
  const weekStart = new Date(now);
  const dayOfWeek = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  // Month start
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  // Year start
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const [todayStats] = await db
    .select({
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, todayStart));

  const [weekStats] = await db
    .select({
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, weekStart));

  const [monthStats] = await db
    .select({
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, monthStart));

  const [yearStats] = await db
    .select({
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, yearStart));

  const [periodTotals] = await db
    .select({
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits)
    .where(gte(websiteVisits.createdAt, startDate));

  const [allTimeStats] = await db
    .select({
      views: sql<number>`count(*)`,
      uniques: sql<number>`count(DISTINCT ${websiteVisits.visitorId})`,
    })
    .from(websiteVisits);

  const totalPeriodViews = Number(periodTotals?.views || 0);

  return {
    revenue: revenueData.map((d) => ({
      ...d,
      date: new Date(d.date).toISOString(),
      amount: Number(d.amount),
    })),
    enrollments: enrollmentData.map((d) => ({
      ...d,
      date: new Date(d.date).toISOString(),
      count: Number(d.count),
    })),
    distribution: courseDistribution.map((d) => ({
      ...d,
      count: Number(d.count),
      fill:
        "var(--color-" +
        (d.name || "Unknown").replace(/[^a-zA-Z0-9]/g, "") +
        ")",
    })),
    traffic: {
      timeline: trafficData.map((d) => ({
        date: new Date(d.date).toISOString(),
        views: Number(d.views),
        uniques: Number(d.uniques),
      })),
      topPages: topPagesData.map((p) => ({
        path: p.path,
        views: Number(p.views),
        uniques: Number(p.uniques),
        percentage:
          totalPeriodViews > 0
            ? Math.round((Number(p.views) / totalPeriodViews) * 100)
            : 0,
      })),
      topReferrers: topReferrersData.map((r) => ({
        name: r.name || "Direct",
        count: Number(r.count),
      })),
      devices: devicesData.map((dev) => ({
        device: dev.device ? dev.device.charAt(0).toUpperCase() + dev.device.slice(1) : "Desktop",
        count: Number(dev.count),
      })),
      summary: {
        periodViews: totalPeriodViews,
        periodUniques: Number(periodTotals?.uniques || 0),
        todayViews: Number(todayStats?.views || 0),
        todayUniques: Number(todayStats?.uniques || 0),
        weekViews: Number(weekStats?.views || 0),
        weekUniques: Number(weekStats?.uniques || 0),
        monthViews: Number(monthStats?.views || 0),
        monthUniques: Number(monthStats?.uniques || 0),
        yearViews: Number(yearStats?.views || 0),
        yearUniques: Number(yearStats?.uniques || 0),
        allTimeViews: Number(allTimeStats?.views || 0),
        allTimeUniques: Number(allTimeStats?.uniques || 0),
      },
    },
  };
}
