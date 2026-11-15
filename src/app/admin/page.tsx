import { getExecutiveOverviewData } from "./actions";
import { AdminDashboardClient } from "./components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const data = await getExecutiveOverviewData();

  return <AdminDashboardClient initialData={data} />;
}
