import { Metadata } from "next";
import {
  getProjectPostMetadata,
  getProjectPostStaticParams,
  getSlugPath,
  ProjectPostView,
} from "./ProjectPostView";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getProjectPostStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  return getProjectPostMetadata(getSlugPath(routeParams.slug));
}

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const routeParams = await params;
  return <ProjectPostView slugPath={getSlugPath(routeParams.slug)} />;
}
