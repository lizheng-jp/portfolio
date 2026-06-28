import { Metadata } from "next";
import { resume } from "@/resources";
import { getProjectPostMetadata, ProjectPostView } from "@/app/work/[slug]/ProjectPostView";

const RESUME_SLUG = "Resume";

export async function generateMetadata(): Promise<Metadata> {
  return getProjectPostMetadata(RESUME_SLUG, undefined, {
    basePath: resume.path,
    pathSlug: "",
  });
}

export default async function ResumePage() {
  return (
    <ProjectPostView
      slugPath={RESUME_SLUG}
      basePath={resume.path}
      pathSlug=""
      parentHref={resume.path}
      parentLabel={resume.label}
      showRelatedProjects={false}
    />
  );
}
