import { notFound } from "next/navigation";
import { Metadata } from "next";
import { normalizeContentLanguage } from "@/utils/utils";
import {
  getProjectPostLanguageStaticParams,
  getProjectPostMetadata,
  getSlugPath,
  ProjectPostView,
} from "../ProjectPostView";

export async function generateStaticParams(): Promise<{ slug: string; lang: string }[]> {
  return getProjectPostLanguageStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[]; lang: string }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const language = normalizeContentLanguage(routeParams.lang);

  if (!language) {
    return {};
  }

  return getProjectPostMetadata(getSlugPath(routeParams.slug), language);
}

export default async function ProjectLanguagePage({
  params,
}: {
  params: Promise<{ slug: string | string[]; lang: string }>;
}) {
  const routeParams = await params;
  const language = normalizeContentLanguage(routeParams.lang);

  if (!language) {
    notFound();
  }

  return <ProjectPostView slugPath={getSlugPath(routeParams.slug)} language={language} />;
}
