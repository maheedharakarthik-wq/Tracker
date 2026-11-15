import { getCmsData } from "./actions";
import { CmsClient } from "./components/CmsClient";

export const dynamic = "force-dynamic";

export default async function AdminCmsPage() {
  const { projects, partners, sections } = await getCmsData();

  return (
    <CmsClient
      initialProjects={projects}
      initialPartners={partners}
      initialSections={sections}
    />
  );
}
