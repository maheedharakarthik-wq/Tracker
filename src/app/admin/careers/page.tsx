import { getCareersAdminData } from "./actions";
import { CareersAdminClient } from "./components/CareersAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminCareersPage() {
  const { jobs, applications } = await getCareersAdminData();

  return (
    <CareersAdminClient
      initialJobs={jobs}
      initialApplications={applications}
    />
  );
}
