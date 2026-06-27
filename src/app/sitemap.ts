import { getPosts } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";

export default async function sitemap() {
  const blogs = getPosts(["src", "app", "blog", "posts"]).flatMap((post) => [
    {
      url: `${baseURL}/blog/${post.slug}`,
      lastModified: post.metadata.publishedAt,
    },
    ...post.variants
      .filter((variant) => variant.language && !variant.isDefault)
      .map((variant) => ({
        url: `${baseURL}/blog/${post.slug}/${variant.language}`,
        lastModified: post.metadata.publishedAt,
      })),
  ]);

  const works = getPosts(["src", "app", "work", "projects"]).flatMap((post) => [
    {
      url: `${baseURL}/work/${post.slug}`,
      lastModified: post.metadata.publishedAt,
    },
    ...post.variants
      .filter((variant) => variant.language && !variant.isDefault)
      .map((variant) => ({
        url: `${baseURL}/work/${post.slug}/${variant.language}`,
        lastModified: post.metadata.publishedAt,
      })),
  ]);

  const activeRoutes = Object.keys(routesConfig).filter(
    (route) => routesConfig[route as keyof typeof routesConfig],
  );

  const routes = activeRoutes.map((route) => ({
    url: `${baseURL}${route !== "/" ? route : ""}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs, ...works];
}
