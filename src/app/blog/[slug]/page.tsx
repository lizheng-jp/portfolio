import { Metadata } from "next";
import {
  BlogPostView,
  getBlogPostMetadata,
  getBlogPostStaticParams,
  getSlugPath,
} from "./BlogPostView";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getBlogPostStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  return getBlogPostMetadata(getSlugPath(routeParams.slug));
}

export default async function Blog({ params }: { params: Promise<{ slug: string | string[] }> }) {
  const routeParams = await params;
  return <BlogPostView slugPath={getSlugPath(routeParams.slug)} />;
}
