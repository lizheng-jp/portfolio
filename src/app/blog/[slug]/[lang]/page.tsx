import { notFound } from "next/navigation";
import { Metadata } from "next";
import { normalizeContentLanguage } from "@/utils/utils";
import {
  BlogPostView,
  getBlogPostLanguageStaticParams,
  getBlogPostMetadata,
  getSlugPath,
} from "../BlogPostView";

export async function generateStaticParams(): Promise<{ slug: string; lang: string }[]> {
  return getBlogPostLanguageStaticParams();
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

  return getBlogPostMetadata(getSlugPath(routeParams.slug), language);
}

export default async function BlogLanguagePage({
  params,
}: {
  params: Promise<{ slug: string | string[]; lang: string }>;
}) {
  const routeParams = await params;
  const language = normalizeContentLanguage(routeParams.lang);

  if (!language) {
    notFound();
  }

  return <BlogPostView slugPath={getSlugPath(routeParams.slug)} language={language} />;
}
