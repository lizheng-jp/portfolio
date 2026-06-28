import { notFound } from "next/navigation";
import { Metadata } from "next";
import { resume } from "@/resources";
import { normalizeContentLanguage } from "@/utils/utils";
import {
  getProjectPostLanguageStaticParams,
  getProjectPostMetadata,
  ProjectPostView,
} from "@/app/work/[slug]/ProjectPostView";

const RESUME_SLUG = "Resume";

export async function generateStaticParams(): Promise<{ lang: string }[]> {
  return getProjectPostLanguageStaticParams()
    .filter((param) => param.slug === RESUME_SLUG)
    .map((param) => ({ lang: param.lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const language = normalizeContentLanguage(routeParams.lang);

  if (!language) {
    return {};
  }

  return getProjectPostMetadata(RESUME_SLUG, language, {
    basePath: resume.path,
    pathSlug: "",
  });
}

export default async function ResumeLanguagePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const routeParams = await params;
  const language = normalizeContentLanguage(routeParams.lang);

  if (!language) {
    notFound();
  }

  return (
    <ProjectPostView
      slugPath={RESUME_SLUG}
      language={language}
      basePath={resume.path}
      pathSlug=""
      parentHref={resume.path}
      parentLabel={resume.label}
      showRelatedProjects={false}
    />
  );
}
